"""
Migration script to update column sizes in MySQL
Run: python migrate_db.py
"""

from sqlalchemy import text
from app.core.database import engine

print("Running database migrations...")

with engine.connect() as conn:
    # Alter description column to TEXT
    try:
        conn.execute(text("ALTER TABLE vehicles MODIFY COLUMN description TEXT"))
        conn.commit()
        print("✓ Updated vehicles.description to TEXT")
    except Exception as e:
        print(f"  vehicles.description: {e}")
    
    # Alter image_url column to VARCHAR(500)
    try:
        conn.execute(text("ALTER TABLE bike_images MODIFY COLUMN image_url VARCHAR(500)"))
        conn.commit()
        print("✓ Updated bike_images.image_url to VARCHAR(500)")
    except Exception as e:
        print(f"  bike_images.image_url: {e}")
    
    # Add phone column to users table
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR(20)"))
        conn.commit()
        print("✓ Added users.phone column")
    except Exception as e:
        print(f"  users.phone: {e}")
    
    # Add new selling-specific columns to vehicles
    new_columns = [
        ("owner_type", "VARCHAR(50) DEFAULT 'first_owner'"),
        ("engine_cc", "INT"),
        ("mileage", "FLOAT"),
        ("color", "VARCHAR(50)"),
        ("insurance_valid", "VARCHAR(100)"),
        ("registration_number", "VARCHAR(50)"),
        ("is_negotiable", "BOOLEAN DEFAULT TRUE"),
        ("is_sold", "BOOLEAN DEFAULT FALSE"),
    ]
    
    for col_name, col_type in new_columns:
        try:
            conn.execute(text(f"ALTER TABLE vehicles ADD COLUMN {col_name} {col_type}"))
            conn.commit()
            print(f"✓ Added vehicles.{col_name}")
        except Exception as e:
            print(f"  vehicles.{col_name}: {e}")

print("\nMigration complete! Now run: python seed_data.py")
