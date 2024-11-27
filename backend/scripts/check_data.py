from app import create_app, db
from app.models import Product

app = create_app()

with app.app_context():
    products = Product.query.all()
    print(f"Total products: {len(products)}")
    for product in products[:5]:  # Print first 5 products
        print(f"""
        Name: {product.name}
        Price: ${product.price}
        Category: {product.category}
        Image: {product.image_url}
        """)