"""Developer-only real Hermes plugin API check; SDK/network explicitly mocked.
Run with the installed Hermes Python, with its source on PYTHONPATH.
No user config is read: load_config and profile secret resolution are mocked.
"""
import importlib.util
from pathlib import Path
import tempfile
from types import SimpleNamespace
from unittest.mock import patch

source = Path(__file__).resolve().parents[1] / 'hermes-stt' / '__init__.py'
spec = importlib.util.spec_from_file_location('aizamin_stt_fixture', source)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
provider = module.AIZaminTranscriptionProvider()
assert provider.default_model() == 'whisper-large-v3-turbo'
assert [m['id'] for m in provider.list_models()] == ['whisper-large-v3-turbo', 'whisper-large-v3']
registered = []
module.register(SimpleNamespace(register_transcription_provider=registered.append))
assert registered[0].name == 'aizamin'
with tempfile.TemporaryDirectory() as tmp:
    audio = Path(tmp) / 'fixture.wav'
    audio.write_bytes(b'mocked audio: never sent to a service')
    with patch('agent.secret_scope.get_secret', return_value='fake-test-key'), patch('hermes_cli.config.load_config', return_value={'stt': {'aizamin': {'base_url': module.ENDPOINT}}}), patch('openai.OpenAI') as client:
        create = client.return_value.__enter__.return_value.audio.transcriptions.create
        create.return_value = SimpleNamespace(text='mock transcript')
        for model in (None, *module.MODELS):
            result = provider.transcribe(str(audio), model=model, language='fa', prompt='vocabulary')
            assert result == {'success': True, 'transcript': 'mock transcript', 'provider': 'aizamin'}
            assert create.call_args.kwargs['model'] == (model or module.MODELS[0])
            assert create.call_args.kwargs['language'] == 'fa'
            assert create.call_args.kwargs['prompt'] == 'vocabulary'
            assert client.call_args.kwargs['base_url'] == module.ENDPOINT
            assert client.call_args.kwargs['api_key'] == 'fake-test-key'
        before = create.call_count
        assert not provider.transcribe(str(audio), model='groq/whisper-large-v3')['success']
        assert create.call_count == before
        create.side_effect = RuntimeError('fake-test-key must not leak')
        assert 'fake-test-key' not in str(provider.transcribe(str(audio)))
        with patch('hermes_cli.config.load_config', return_value={'stt': {'aizamin': {'base_url': 'https://example.com/v1'}}}):
            before = create.call_count
            assert not provider.transcribe(str(audio))['success']
            assert create.call_count == before
print('Real installed Hermes STT ABC + plugin: both exact model IDs, endpoint, credential channel and fail-closed errors verified with mocked SDK; no paid request.')
