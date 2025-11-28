from sqlalchemy import Column, Integer, String, ForeignKey, Float, Text, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100))
    brand = Column(String(100))
    model = Column(String(100))
    price = Column(Float)  # Selling price
    year = Column(Integer)
    km_driven = Column(Integer)
    fuel_type = Column(String(100))
    location = Column(String(100))
    description = Column(Text)
    
    # New selling-specific fields
    owner_type = Column(String(50))  # 'first_owner', 'second_owner', 'third_owner', etc.
    engine_cc = Column(Integer)  # Engine capacity in CC
    mileage = Column(Float)  # Mileage in km/l
    color = Column(String(50))
    insurance_valid = Column(String(100))  # Insurance validity date/status
    registration_number = Column(String(50))
    is_negotiable = Column(Boolean, default=True)
    is_sold = Column(Boolean, default=False)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User")


class BikeImage(Base):
    __tablename__ = "bike_images"

    id = Column(Integer, primary_key=True, index=True)
    bike_id = Column(Integer, ForeignKey("vehicles.id", ondelete="CASCADE"))
    image_url = Column(String(500))
