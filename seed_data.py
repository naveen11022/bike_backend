"""
Seed script to populate database with sample users and bikes
Run: python seed_data.py
"""

from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.vehicle import Vehicle, BikeImage
from app.utils.hashing import hash_password

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Clear existing data (optional)
db.query(BikeImage).delete()
db.query(Vehicle).delete()
db.query(User).delete()
db.commit()

print("Creating users...")

# Sample Users
users_data = [
    {"name": "John Doe", "email": "john@example.com", "phone": "+91 9876543210", "password": "password123"},
    {"name": "Jane Smith", "email": "jane@example.com", "phone": "+91 9123456789", "password": "password123"},
    {"name": "Admin User", "email": "admin@bikerent.com", "phone": "+91 9988776655", "password": "admin123"},
]

users = []
for u in users_data:
    user = User(name=u["name"], email=u["email"], phone=u["phone"], password=hash_password(u["password"]))
    db.add(user)
    db.commit()
    db.refresh(user)
    users.append(user)
    print(f"  Created user: {u['email']} / {u['password']}")

print("\nCreating bikes...")

# Sample Bikes
bikes_data = [
    {
        "title": "Royal Enfield Classic 350",
        "brand": "Royal Enfield",
        "model": "Classic 350",
        "price": 800,
        "year": 2023,
        "km_driven": 5000,
        "fuel_type": "Petrol",
        "location": "Mumbai",
        "description": "Iconic retro-styled motorcycle with a thumping 350cc engine. Perfect for city rides and weekend getaways.",
        "images": [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
            "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800"
        ]
    },
    {
        "title": "Honda CBR 650R",
        "brand": "Honda",
        "model": "CBR 650R",
        "price": 1500,
        "year": 2022,
        "km_driven": 8000,
        "fuel_type": "Petrol",
        "location": "Delhi",
        "description": "Sporty inline-four motorcycle with aggressive styling. Great for track days and spirited riding.",
        "images": [
            "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800",
            "https://images.unsplash.com/photo-1547549082-6bc09f2049ae?w=800"
        ]
    },
    {
        "title": "Yamaha MT-15",
        "brand": "Yamaha",
        "model": "MT-15 V2",
        "price": 600,
        "year": 2023,
        "km_driven": 3000,
        "fuel_type": "Petrol",
        "location": "Bangalore",
        "description": "Streetfighter with aggressive looks and nimble handling. Perfect for daily commuting.",
        "images": [
            "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800"
        ]
    },
    {
        "title": "KTM Duke 390",
        "brand": "KTM",
        "model": "390 Duke",
        "price": 1000,
        "year": 2023,
        "km_driven": 4500,
        "fuel_type": "Petrol",
        "location": "Pune",
        "description": "The corner rocket! Lightweight, powerful, and ready for action.",
        "images": [
            "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800",
            "https://images.unsplash.com/photo-1622185135505-2d795003994a?w=800"
        ]
    },
    {
        "title": "Bajaj Pulsar NS200",
        "brand": "Bajaj",
        "model": "Pulsar NS200",
        "price": 450,
        "year": 2022,
        "km_driven": 12000,
        "fuel_type": "Petrol",
        "location": "Chennai",
        "description": "Affordable performance bike with great fuel efficiency and sporty looks.",
        "images": [
            "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800"
        ]
    },
    {
        "title": "Harley Davidson Iron 883",
        "brand": "Harley-Davidson",
        "model": "Iron 883",
        "price": 2500,
        "year": 2021,
        "km_driven": 15000,
        "fuel_type": "Petrol",
        "location": "Mumbai",
        "description": "Classic American cruiser with unmistakable Harley sound and presence.",
        "images": [
            "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800",
            "https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=800"
        ]
    },
    {
        "title": "Suzuki Gixxer SF 250",
        "brand": "Suzuki",
        "model": "Gixxer SF 250",
        "price": 700,
        "year": 2023,
        "km_driven": 2000,
        "fuel_type": "Petrol",
        "location": "Hyderabad",
        "description": "Fully faired sports bike with smooth engine and comfortable ergonomics.",
        "images": [
            "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800"
        ]
    },
    {
        "title": "BMW G 310 R",
        "brand": "BMW",
        "model": "G 310 R",
        "price": 1200,
        "year": 2022,
        "km_driven": 6000,
        "fuel_type": "Petrol",
        "location": "Kolkata",
        "description": "German engineering in an accessible package. Premium build quality.",
        "images": [
            "https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=800"
        ]
    },
]

for i, bike_data in enumerate(bikes_data):
    images = bike_data.pop("images")
    owner = users[i % len(users)]
    
    vehicle = Vehicle(**bike_data, owner_id=owner.id)
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    
    # Add images
    for img_url in images:
        img = BikeImage(bike_id=vehicle.id, image_url=img_url)
        db.add(img)
    
    db.commit()
    print(f"  Created bike: {bike_data['title']}")

db.close()

print("\n" + "="*50)
print("SEED DATA CREATED SUCCESSFULLY!")
print("="*50)
print("\n📧 LOGIN CREDENTIALS:")
print("-"*50)
print("Email: john@example.com     | Password: password123")
print("Email: jane@example.com     | Password: password123")
print("Email: admin@bikerent.com   | Password: admin123")
print("-"*50)
print(f"\n🏍️  {len(bikes_data)} bikes added to database")
print("\nYou can now start the server: uvicorn app.main:app --reload")
