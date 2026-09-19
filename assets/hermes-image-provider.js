/* Downloadable Hermes native backend: install manifest as plugin.yaml and
 * source as __init__.py under $HERMES_HOME/plugins/image_gen/aizamin/.
 * Enable image_gen/aizamin, then select image_gen.provider = aizamin.
 * Uses the installed Hermes catalog; never rewrites the built-in provider.
 */
(function (root) {
  'use strict';

  const manifest = `name: aizamin
version: 1.0.0
description: AI Zamin image generation and editing using named provider credentials
author: AI Zamin
kind: backend
`;

  const source = String.raw`"""Native AI Zamin image backend; credentials stay scoped to the named provider."""
from contextlib import ExitStack, closing
import base64
import io
from pathlib import Path
from urllib.parse import urlparse

from agent.image_gen_provider import (
    ImageGenProvider, DEFAULT_ASPECT_RATIO, error_response,
    resolve_aspect_ratio, save_b64_image, save_url_image, success_response,
)
from plugins.image_gen.openai import MODELS
from plugins.image_gen._common import catalog_rows, collect_source_images, size_for

DEFAULT_MODEL = "gpt-image-2.5-flare-medium"
REQUEST_TIMEOUT = 180.0
SOURCE_TIMEOUT = 30.0
MAX_IMAGE_BYTES = 25 * 1024 * 1024


def _runtime(model=None):
    # Public native resolver honors key_env, credential pools and key_cmd.
    # Guard the named lookup so a missing entry cannot fall back to another API.
    from hermes_cli.runtime_provider_custom import has_named_custom_provider
    from hermes_cli.runtime_provider import resolve_runtime_provider
    if not has_named_custom_provider("aizamin"):
        raise ValueError("Named provider is not configured")
    runtime = resolve_runtime_provider(requested="aizamin", target_model=model)
    key = runtime.get("api_key")
    if callable(key):
        key = key()
    url = runtime.get("base_url")
    if not isinstance(key, str) or not key.strip() or not isinstance(url, str):
        raise ValueError("Named provider credentials are unavailable")
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https") or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError("Invalid named provider endpoint")
    return key, url, runtime.get("extra_headers") or {}


def _selected_model(explicit):
    from hermes_cli.config import load_config
    config = load_config()
    section = config.get("image_gen") or {}
    scoped = section.get("aizamin") or {}
    # Never silently replace a misspelled explicit/configured model with a paid default.
    model = explicit if explicit is not None else scoped.get("model", section.get("model", DEFAULT_MODEL))
    if not isinstance(model, str) or model not in MODELS:
        raise ValueError("Unknown image model")
    return model, MODELS[model]


def _source_stream(ref):
    """Bounded input loading, credential-file guard, and named multipart bytes."""
    lower = ref.lower()
    name = "image.png"
    if lower.startswith(("https://", "http://")):
        import requests
        # No provider Authorization header is forwarded to reference URLs.
        with requests.get(ref, timeout=SOURCE_TIMEOUT, stream=True) as response:
            response.raise_for_status()
            chunks, total = [], 0
            for chunk in response.iter_content(64 * 1024):
                total += len(chunk)
                if total > MAX_IMAGE_BYTES:
                    raise ValueError("Source image too large")
                chunks.append(chunk)
            data = b"".join(chunks)
        name = Path(urlparse(ref).path).name or name
    elif lower.startswith("data:"):
        header, separator, encoded = ref.partition(",")
        if not separator or not header.lower().startswith("data:image/") or not header.lower().endswith(";base64"):
            raise ValueError("Expected base64 image data URI")
        if len(encoded) > ((MAX_IMAGE_BYTES + 2) // 3) * 4:
            raise ValueError("Source image too large")
        data = base64.b64decode(encoded, validate=True)
        subtype = header.split("/", 1)[1].split(";", 1)[0].lower()
        name = "image." + {"jpeg": "jpg", "png": "png", "webp": "webp", "gif": "gif"}.get(subtype, "png")
    else:
        from agent.file_safety import raise_if_read_blocked
        raise_if_read_blocked(ref)
        with open(ref, "rb") as handle:
            data = handle.read(MAX_IMAGE_BYTES + 1)
        name = Path(ref).name or name
    if not data or len(data) > MAX_IMAGE_BYTES:
        raise ValueError("Empty or oversized source image")
    stream = io.BytesIO(data)
    stream.name = name
    return stream


class AIZaminImageGenProvider(ImageGenProvider):
    @property
    def name(self):
        return "aizamin"

    @property
    def display_name(self):
        return "AI Zamin"

    def default_model(self):
        return DEFAULT_MODEL

    def list_models(self):
        return catalog_rows(MODELS)

    def capabilities(self):
        return {"modalities": ["text", "image"], "max_reference_images": 16}

    def get_setup_schema(self):
        return {
            "name": "AI Zamin", "badge": "paid",
            "tag": "GPT Image generation and editing via the named aizamin provider",
            "env_vars": [{"key": "HERMES_CUSTOM_AIZAMIN_API_KEY", "prompt": "AI Zamin API key"}],
        }

    def is_available(self):
        try:
            import openai
            _runtime()
            return True
        except Exception:
            return False

    def generate(self, prompt, aspect_ratio=DEFAULT_ASPECT_RATIO, *,
                 image_url=None, reference_image_urls=None, **kwargs):
        aspect = resolve_aspect_ratio(aspect_ratio)
        model = ""
        prompt = prompt.strip() if isinstance(prompt, str) else ""

        def fail(message, kind):
            return error_response(error=message, error_type=kind, provider=self.name,
                                  model=model, prompt=prompt, aspect_ratio=aspect)

        if not prompt:
            return fail("A non-empty prompt is required.", "invalid_input")
        try:
            model, meta = _selected_model(kwargs.get("model"))
        except Exception:
            return fail("Unknown or invalid image model. Choose an installed AI Zamin catalog ID; check image_gen.aizamin.model and image_gen.model.", "invalid_model")
        try:
            import openai
        except ImportError:
            return fail("The openai Python package is required.", "missing_dependency")
        try:
            key, url, headers = _runtime(meta["api_model"])
        except Exception:
            return fail("Configure the named aizamin provider endpoint and credentials in Hermes.", "auth_required")

        sources = collect_source_images(image_url, reference_image_urls, limit=16)
        size = size_for(aspect)
        stage = "io_error"
        try:
            with ExitStack() as stack:
                # Register each stream immediately so partial reference failures also close it.
                files = [stack.enter_context(closing(_source_stream(ref))) for ref in sources]
                stage = "api_error"
                client = stack.enter_context(closing(openai.OpenAI(
                    api_key=key, base_url=url, default_headers=headers,
                    organization="", project="", timeout=REQUEST_TIMEOUT, max_retries=0,
                )))
                request = dict(model=meta["api_model"], prompt=prompt, size=size,
                               n=1, quality=meta["quality"])
                # GPT image endpoints reject response_format; base64 is the native default.
                if files:
                    request["image"] = files if len(files) > 1 else files[0]
                    response = client.images.edit(**request)
                else:
                    response = client.images.generate(**request)
                data = getattr(response, "data", None) or []
                if not data:
                    return fail("AI Zamin returned no image data.", "empty_response")
                first = data[0]
                b64, image_url_out = getattr(first, "b64_json", None), getattr(first, "url", None)
                stage = "io_error"
                if b64:
                    image = str(save_b64_image(b64, prefix="aizamin"))
                elif image_url_out:
                    image = str(save_url_image(image_url_out, prefix="aizamin", timeout=SOURCE_TIMEOUT,
                                               max_bytes=MAX_IMAGE_BYTES))
                else:
                    return fail("AI Zamin returned no image data.", "empty_response")
            return success_response(image=image, model=model, prompt=prompt, aspect_ratio=aspect,
                                    provider=self.name, modality="image" if sources else "text",
                                    extra={"size": size, "quality": meta["quality"]})
        except Exception:
            # SDK exceptions can contain Authorization, signed URLs and response bodies.
            # Never echo or log them, including failures during close/cache operations.
            message = ("AI Zamin image request failed. Check provider access, quota and model availability."
                       if stage == "api_error" else "Could not read or save image data. Check image sources and cache permissions.")
            return fail(message, stage)


def register(ctx):
    ctx.register_image_gen_provider(AIZaminImageGenProvider())
`;

  const payload = { manifest, source };
  if (typeof module === 'object' && module.exports) module.exports = payload;
  root.AIZaminHermesImageProvider = payload;
})(globalThis);
