import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = (
        f"{os.getenv('DB_DRIVER')}://{os.getenv('DB_USERNAME')}:"
        f"{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/"
        f"{os.getenv('DB_NAME')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.urandom(24)

