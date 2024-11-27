import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:password@localhost:3307/product_search'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6380')
    CACHE_TTL = 300