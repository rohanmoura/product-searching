import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from faker import Faker
import random
from app import db, create_app
from app.models import Product

fake = Faker()

def generate_products(count=50):
    app = create_app()
    with app.app_context():
        # Clear existing products
        Product.query.delete()
        
        categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports']
        
        for _ in range(count):
            product = Product(
                name=fake.catch_phrase(),
                description=fake.text(max_nb_chars=200),
                price=round(random.uniform(10.0, 1000.0), 2),
                category=random.choice(categories),
                image_url=f"https://picsum.photos/400/400?random={_}",
                rating=round(random.uniform(3.0, 5.0), 1),
                stock=random.randint(0, 100),
                brand=fake.company()
            )
            db.session.add(product)
        
        db.session.commit()
        print(f"{count} products generated successfully!")

if __name__ == "__main__":
    generate_products(50) 