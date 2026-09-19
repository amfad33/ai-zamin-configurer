"""AI Zamin STT: use Hermes' plugin API, never its model-correcting OpenAI route."""
from agent.transcription_provider import TranscriptionProvider

MODELS = ("whisper-large-v3-turbo", "whisper-large-v3")
ENDPOINT = "https://aizamin.ir/v1"


class AIZaminTranscriptionProvider(TranscriptionProvider):
    @property
    def name(self):
        return "aizamin"

    @property
    def display_name(self):
        return "AI Zamin Whisper"

    def default_model(self):
        return MODELS[0]

    def list_models(self):
        return [{"id": model, "display": model} for model in MODELS]

    def is_available(self):
        from agent.secret_scope import get_secret
        return bool(get_secret("HERMES_CUSTOM_AIZAMIN_API_KEY"))

    def transcribe(self, file_path, *, model=None, language=None, **extra):
        failure = {"success": False, "transcript": "", "provider": self.name}
        model = model or self.default_model()
        if model not in MODELS:
            return {**failure, "error": "Unsupported AI Zamin STT model; choose whisper-large-v3-turbo or whisper-large-v3."}
        try:
            from agent.secret_scope import get_secret
            from hermes_cli.config import load_config
            from openai import OpenAI
            key = get_secret("HERMES_CUSTOM_AIZAMIN_API_KEY")
            if not key:
                return {**failure, "error": "Re-run the AI Zamin configurer to configure your API key."}
            cfg = (load_config().get("stt") or {}).get("aizamin") or {}
            # A purchased gateway key must never be sent to another endpoint.
            base_url = cfg.get("base_url", ENDPOINT)
            if base_url.rstrip("/") != ENDPOINT:
                return {**failure, "error": "AI Zamin STT base_url must be https://aizamin.ir/v1."}
            kwargs = {"model": model, "response_format": "json"}
            if language:
                kwargs["language"] = language
            if extra.get("prompt"):
                kwargs["prompt"] = extra["prompt"]
            with OpenAI(api_key=key, base_url=ENDPOINT, timeout=120, max_retries=0) as client:
                with open(file_path, "rb") as audio:
                    result = client.audio.transcriptions.create(file=audio, **kwargs)
            text = getattr(result, "text", None)
            if not isinstance(text, str) or not text.strip():
                return {**failure, "error": "AI Zamin returned no transcription text."}
            return {"success": True, "transcript": text.strip(), "provider": self.name}
        except Exception:
            # SDK exceptions may contain request/credential details. Do not echo them.
            return {**failure, "error": "AI Zamin transcription failed; check connectivity, credit and model access. No fallback was used."}


def register(ctx):
    ctx.register_transcription_provider(AIZaminTranscriptionProvider())
