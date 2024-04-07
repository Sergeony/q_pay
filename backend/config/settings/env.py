import os

import environ


env = environ.Env()

ENV_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
env_file = os.path.join(ENV_DIR, ".env")

if os.path.isfile(env_file):
    environ.Env.read_env(env_file)
