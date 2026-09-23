"""AI Zamin live catalog. Loaded by Hermes' native provider plugin discovery.

No catalog is shipped or retained as a failure fallback. Each new Hermes process
reconciles its managed profile before model resolution. Restart the Hermes
process to guarantee removal of a selected model; native in-process pickers may
cache or reinsert that selection even after /model --refresh.
"""
import json
import logging
import os
import sys
from urllib.request import Request
from providers import register_provider
from providers.base import ProviderProfile

log = logging.getLogger(__name__)
ERROR = 'AI Zamin model catalog unavailable; check connectivity/key and restart Hermes.'

class AIZaminProfile(ProviderProfile):
    def create_client(self, **client_kwargs):
        if not self.fetch_models(api_key=client_kwargs.get('api_key')):
            raise RuntimeError(ERROR)
        return None

    def fetch_models(self, *, api_key=None, base_url=None, timeout=8.0):
        from hermes_cli.urllib_security import open_credentialed_url
        from hermes_cli.config import get_env_value
        # Discovery can precede dotenv hydration. Use Hermes' profile-aware
        # resolver, which also reads the installed profile's .env on cold start.
        key = api_key or get_env_value('HERMES_CUSTOM_AIZAMIN_API_KEY') or ''
        try:
            req = Request(self.models_url, headers={'Authorization': 'Bearer '+key, 'Accept':'application/json', 'User-Agent':'AI-Zamin-Configurer/1.0'})
            with open_credentialed_url(req, timeout=timeout) as response:
                payload = json.load(response)
            if not isinstance(payload, dict) or not isinstance(payload.get('data'),list):
                raise ValueError('invalid catalog')
            models = sorted({row['id'] for row in payload['data'] if isinstance(row,dict) and isinstance(row.get('id'),str) and row['id']})
            self.fallback_models = ()
            return models
        except Exception:
            log.error(ERROR)
            self.fallback_models = ()
            return []

from hermes_cli.config import read_user_config_raw, save_config
config = read_user_config_raw()
settings = config.get('aizamin_catalog', {})
profile = AIZaminProfile(name='aizamin', display_name='AI Zamin',
    env_vars=('HERMES_CUSTOM_AIZAMIN_API_KEY',), base_url='https://aizamin.ir/v1',
    models_url=settings.get('url','https://aizamin.ir/hermes-standard/v1/models'),
    fallback_models=())
register_provider(profile)
# No network for installer/config commands before activation.
if settings.get('url') and config.get('model',{}).get('provider') == 'aizamin' and not any(arg in {'config','plugins','profile','--version','--help'} for arg in sys.argv[1:]):
    models = profile.fetch_models()
    selected = config['model'].get('default')
    config['model']['default'] = selected if selected in models else (models[0] if models else 'aizamin-catalog-unavailable')
    config.setdefault('providers',{}).pop('aizamin',None)
    save_config(config)
    # Native Hermes caches can otherwise resurrect delisted IDs for days.
    from hermes_constants import get_hermes_home
    cache_path=get_hermes_home()/'provider_models_cache.json'
    if cache_path.exists():
        try:
            cache=json.loads(cache_path.read_text(encoding='utf-8'))
            cache.pop('aizamin',None)
            cache_path.write_text(json.dumps(cache),encoding='utf-8')
        except (OSError,ValueError):
            log.warning('AI Zamin could not clear its model cache')
