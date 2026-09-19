(() => {
  const ENDPOINT = 'https://aizamin.ir/v1';
  const DEFAULT_MODEL = 'gpt-5.5';
  // Audio models belong to STT settings, never the coding/chat catalog.
  const isSTTModel = id => /^(?:groq\/)?(?:whisper(?:-|$)|distil-whisper(?:-|$))/.test(id);
  // Explicit capabilities for proxy aliases absent from upstream model catalogs.
  const VISION_MODELS = ['gpt-5.2', 'gpt-5.6', 'gpt-5.6-sol', 'gpt-5.6-terra', 'gpt-5.6-luna', 'gpt-5.5', 'gpt-5.4', 'gpt-5.4-mini', 'codex-mini-latest'];
  const labels = { codex: 'Codex', hermes: 'Hermes', opencode: 'OpenCode' };
  const openCodeConfig = key => {
    const variants = (includeMax = false) => ({
      low: {}, medium: {}, high: {}, xhigh: {}, ...(includeMax ? { max: {} } : {}),
    });
    const model = (name, context, output, includeMax = false) => ({
      name,
      // OpenCode's official provider model schema: attachment + modalities.
      attachment: !name.includes('Spark'),
      modalities: { input: name.includes('Spark') ? ['text'] : ['text', 'image'], output: ['text'] },
      limit: { context, output },
      options: { store: false },
      variants: variants(includeMax),
    });
    return {
      options: { baseURL: ENDPOINT, apiKey: key },
      models: {
        'gpt-5.2': model('GPT-5.2', 400000, 128000),
        'gpt-5.6': model('GPT-5.6 (Sol)', 1050000, 128000, true),
        'gpt-5.6-sol': model('GPT-5.6 Sol', 1050000, 128000, true),
        'gpt-5.6-terra': model('GPT-5.6 Terra', 1050000, 128000, true),
        'gpt-5.6-luna': model('GPT-5.6 Luna', 1050000, 128000, true),
        'gpt-5.5': model('GPT-5.5', 1050000, 128000),
        'gpt-5.4': model('GPT-5.4', 1050000, 128000),
        'gpt-5.4-mini': model('GPT-5.4 Mini', 400000, 128000),
        'gpt-5.3-codex-spark': model('GPT-5.3 Codex Spark', 128000, 32000),
        'codex-mini-latest': {
          name: 'Codex Mini',
          attachment: true,
          modalities: { input: ['text', 'image'], output: ['text'] },
          limit: { context: 200000, output: 100000 },
          options: { store: false },
          variants: { low: {}, medium: {}, high: {} },
        },
      },
    };
  };

  // One Images API implementation for the Codex MCP and OpenCode custom tool.
  // Fail closed: no placeholder/SVG or silent model substitution on API errors.
  const generateImage = async (prompt, key, directory, referenceImages = []) => {
    if (typeof prompt !== 'string' || !prompt.trim()) throw new Error('A non-empty image prompt is required.');
    if (!key) throw new Error('Re-run the AI Zamin configurer to configure an image API key.');
    if (!Array.isArray(referenceImages) || referenceImages.length > 4) throw new Error('reference_images must contain at most 4 local image paths.');
    const payload = { model: 'gpt-image-2.5-flare', prompt, n: 1, size: '1024x1024', quality: 'medium', output_format: 'png' };
    const headers = { Authorization: 'Bearer ' + key };
    let body, total = 0;
    if (referenceImages.length) {
      body = new FormData();
      for (const [field, value] of Object.entries(payload)) body.append(field, String(value));
      for (const source of referenceImages) {
        // Explicit absolute paths only: never fetch URLs or interpret data as filenames.
        if (typeof source !== 'string' || !isAbsolute(source) || source.includes('\0')) throw new Error('Each reference must be an absolute local image path.');
        const fd = openSync(source, constants.O_RDONLY | (constants.O_NONBLOCK || 0));
        let bytes;
        try {
          const stat = fstatSync(fd);
          if (!stat.isFile() || stat.size < 12 || stat.size > 10 * 1024 * 1024 || total + stat.size > 20 * 1024 * 1024) throw new Error('References must be regular image files, at most 10 MiB each and 20 MiB total.');
          // Bounded descriptor reads avoid unbounded allocations if the file grows.
          bytes = Buffer.alloc(stat.size);
          let offset = 0;
          while (offset < bytes.length) {
            const count = readSync(fd, bytes, offset, bytes.length - offset, offset);
            if (!count) throw new Error('Reference image changed while reading.');
            offset += count;
          }
          if (fstatSync(fd).size !== stat.size) throw new Error('Reference image changed while reading.');
        } finally { closeSync(fd); }
        total += bytes.length;
        const png = bytes.length >= 45 && bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a' && bytes.subarray(12, 16).toString() === 'IHDR' && bytes.subarray(-8, -4).toString() === 'IEND';
        const jpeg = bytes.subarray(0, 3).toString('hex') === 'ffd8ff' && bytes.subarray(-2).toString('hex') === 'ffd9';
        const webp = bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP';
        if (!png && !jpeg && !webp) throw new Error('Reference must be a PNG, JPEG or WebP image (not SVG, audio or video).');
        const ext = png ? 'png' : jpeg ? 'jpeg' : 'webp';
        body.append('image[]', new Blob([bytes], { type: 'image/' + ext }), 'reference.' + ext);
      }
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(payload);
    }
    const response = await fetch(referenceImages.length ? 'https://aizamin.ir/v1/images/edits' : 'https://aizamin.ir/v1/images/generations', {
      method: 'POST',
      headers,
      body,
      signal: AbortSignal.timeout(300000),
    });
    if (!response.ok) throw new Error('AI Zamin image generation failed (HTTP ' + response.status + '). No image was generated; check credit/model access and retry.');
    const result = await response.json();
    const image = result.data?.[0]?.b64_json;
    if (typeof image !== 'string' || !image) throw new Error('AI Zamin returned no image data.');
    const bytes = Buffer.from(image, 'base64');
    if (bytes.length < 45 || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' || bytes.subarray(12, 16).toString() !== 'IHDR' || bytes.subarray(-8, -4).toString() !== 'IEND') throw new Error('AI Zamin returned an invalid PNG.');
    mkdirSync(directory, { recursive: true });
    const output = join(directory, randomUUID() + '.png');
    writeFileSync(output, bytes, { flag: 'wx', mode: 0o600 });
    return 'Image saved to ' + output + '. Open it with your image-reading tool (Codex view_image / OpenCode read) to inspect the actual pixels before describing it.';
  };
  // OpenCode loads global custom tools from its configuration directory.
  // The dedicated JSON credential file stays parseable if users edit JSONC.
  const openCodeImageTool = `import { tool } from "@opencode-ai/plugin";
import { readFileSync, mkdirSync, writeFileSync, openSync, fstatSync, readSync, closeSync, constants } from "node:fs";
import { dirname, join, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
const generateImage = ${generateImage.toString()};
export default tool({
  description: "Generate or edit a real PNG with AI Zamin GPT Image 2.5 Flare. Uses paid API credit. Report failures, never substitute SVG.",
  args: { prompt: tool.schema.string().min(1), reference_images: tool.schema.array(tool.schema.string()).max(4).optional().describe("Absolute local PNG/JPEG/WebP paths to edit; max 10 MiB each, 20 MiB total. Omit for text-to-image.") },
  async execute({ prompt, reference_images }, context) {
    const config = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../aizamin-image.json"), "utf8"));
    return generateImage(prompt, config.apiKey, join(context.directory, ".opencode", "images"), reference_images);
  },
});
`;

  // The browser appends JSON + uint64 little-endian length + magic to the
  // prebuilt native executable. API keys never go to the binary download URL.
  const buildInstaller = (app, os, key, model = DEFAULT_MODEL, models = VISION_MODELS, arch = 'amd64') => {
    if (!['codex', 'hermes', 'opencode'].includes(app)) throw new Error('Unsupported app');
    if (!['windows', 'macos', 'linux'].includes(os)) throw new Error('Unsupported OS');
    if (!['amd64', 'arm64'].includes(arch)) throw new Error('Unsupported architecture');
    if (typeof key !== 'string' || !key.trim() || /[\r\n\0]/.test(key)) throw new Error('API key must be a non-empty single line');
    if (typeof model !== 'string' || !model || /[\r\n\0]/.test(model)) throw new Error('Model ID must be a non-empty single line');
    if (!Array.isArray(models) || models.some(id => typeof id !== 'string' || !id || /[\r\n\0]/.test(id))) throw new Error('Invalid model catalog');
    if (isSTTModel(model)) throw new Error('Speech models cannot be selected as coding models');
    models = models.filter(id => !isSTTModel(id));
    const payload = { version: 1, app, key, model };
    if (app === 'opencode') Object.assign(payload, { provider: openCodeConfig(key), tool: openCodeImageTool });
    if (app === 'hermes') {
      const plugin = typeof module !== 'undefined' && module.exports ? require('./assets/hermes-image-provider.js') : globalThis.AIZaminHermesImageProvider;
      if (!plugin) throw new Error('Reload the setup page to load the AI Zamin image provider.');
      payload.plugin = { 'plugin.yaml': plugin.manifest, '__init__.py': plugin.source };
      payload.catalog = Object.fromEntries([...new Set([model, ...models])].map(id => [id, VISION_MODELS.includes(id) ? { supports_vision: true } : {}]));
    }
    const suffix = os === 'windows' ? '.exe' : '.run';
    return {
      filename: `aizamin-${app}-setup-${os}-${arch}${os === 'macos' ? '.command' : suffix}`,
      os, mime: 'application/octet-stream', payload,
      binaryUrl: `/assets/configurers/aizamin-configurer-${os}-${arch}${suffix}?v=native-stt-v2`,
      content: `AI Zamin native configurer (${os}/${arch})\nNo external Node/Python/Go runtime installation. Existing files get timestamped .aizamin.backup copies.\nOpen-source configuration helper: https://github.com/amfad33/ai-zamin-configurer\nThis is the configuration preview, not executable source. Keep it private; the reusable download contains no key.\n\n${JSON.stringify(payload, null, 2)}`,
    };
  };
  const assembleInstaller = (binary, artifact) => {
    const config = new TextEncoder().encode(JSON.stringify(artifact.payload));
    if (artifact.os === 'macos') {
      // Never append to a signed Mach-O: preserve the Go linker signature.
      const bytes = new Uint8Array(binary.buffer || binary, binary.byteOffset || 0, binary.byteLength);
      const base64 = value => { let text = ''; for (let i = 0; i < value.length; i += 32768) text += String.fromCharCode(...value.subarray(i, i + 32768)); return btoa(text); };
      const script = `#!/bin/sh\nset -eu\numask 077\nwork=$(/usr/bin/mktemp -d)\ntrap '/bin/rm -rf "$work"' EXIT HUP INT TERM\n/usr/bin/base64 -D > "$work/configurer" <<'AIZAMIN_BINARY'\n${base64(bytes)}\nAIZAMIN_BINARY\n/usr/bin/base64 -D > "$work/payload.json" <<'AIZAMIN_PAYLOAD'\n${base64(config)}\nAIZAMIN_PAYLOAD\n/bin/chmod 700 "$work/configurer"\n"$work/configurer" --payload "$work/payload.json"\n`;
      return new TextEncoder().encode(script);
    }
    const magic = new TextEncoder().encode('AIZAMIN_CONFIG_V1');
    const output = new Uint8Array(binary.byteLength + config.length + 8 + magic.length);
    output.set(new Uint8Array(binary.buffer || binary, binary.byteOffset || 0, binary.byteLength));
    output.set(config, binary.byteLength);
    new DataView(output.buffer).setBigUint64(binary.byteLength + config.length, BigInt(config.length), true);
    output.set(magic, output.length - magic.length);
    return output;
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = { buildInstaller, assembleInstaller };
})();
