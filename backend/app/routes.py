from flask import Blueprint, jsonify, request, current_app
from app.models import Product, db
from sqlalchemy import or_
from app.cache import get_cached_data, set_cached_data
import hashlib

main = Blueprint('main', __name__)

def generate_cache_key(query_params):
    # Create unique key based on search parameters
    params_str = str(sorted(query_params.items()))
    return f"products:{hashlib.md5(params_str.encode()).hexdigest()}"

@main.route('/api/products', methods=['GET'])
def get_products():
    try:
        # Get all query parameters
        params = dict(request.args)
        cache_key = generate_cache_key(params)
        
        # Try to get cached data
        cached_data = get_cached_data(cache_key)
        if cached_data:
            return jsonify(cached_data)

        # If no cache, query database
        search = params.get('search', '')
        category = params.get('category')
        sort = params.get('sort')
        page = int(params.get('page', 1))
        per_page = int(params.get('per_page', 10))

        query = Product.query

        if search:
            query = query.filter(
                or_(
                    Product.name.ilike(f'%{search}%'),
                    Product.description.ilike(f'%{search}%')
                )
            )

        if category:
            query = query.filter(Product.category == category)

        if sort == 'price_asc':
            query = query.order_by(Product.price.asc())
        elif sort == 'price_desc':
            query = query.order_by(Product.price.desc())

        page_obj = query.paginate(page=page, per_page=per_page)
        
        response_data = {
            'items': [product.to_dict() for product in page_obj.items],
            'total': page_obj.total,
            'pages': page_obj.pages,
            'current_page': page_obj.page
        }

        # Cache the results
        set_cached_data(cache_key, response_data)
        
        return jsonify(response_data)
    except Exception as e:
        current_app.logger.error(f"Error fetching products: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@main.route('/api/categories', methods=['GET'])
def get_categories():
    cache_key = "categories:all"
    
    # Try to get cached categories
    cached_categories = get_cached_data(cache_key)
    if cached_categories:
        return jsonify(cached_categories)
        
    # If no cache, query database
    categories = db.session.query(Product.category).distinct().all()
    categories_list = [category[0] for category in categories if category[0]]
    
    # Cache the results
    set_cached_data(cache_key, categories_list)
    
    return jsonify(categories_list)
  