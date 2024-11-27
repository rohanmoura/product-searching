import json
import redis
from flask import current_app

def get_redis_client():
    return redis.Redis.from_url(current_app.config['REDIS_URL'])

def get_cached_data(key):
    try:
        client = get_redis_client()
        data = client.get(key)
        return json.loads(data) if data else None
    except Exception as e:
        current_app.logger.warning(f"Cache error: {str(e)}")
        return None

def set_cached_data(key, data, ttl=300):
    client = get_redis_client()
    client.setex(key, ttl, json.dumps(data))