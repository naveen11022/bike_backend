from pydantic import BaseModel
from typing import List, Optional


class VehicleCreate(BaseModel):
    title: str
    brand: str
    model: str
    price: float
    year: int
    km_driven: int
    fuel_type: str
    location: str
    description: str
    owner_type: Optional[str] = "first_owner"
    engine_cc: Optional[int] = None
    mileage: Optional[float] = None
    color: Optional[str] = None
    insurance_valid: Optional[str] = None
    registration_number: Optional[str] = None
    is_negotiable: Optional[bool] = True


class VehicleOut(VehicleCreate):
    id: int
    owner_id: int
    is_sold: bool = False
    
    class Config:
        from_attributes = True


class BikeImageOut(BaseModel):
    id: int
    image_url: str

    class Config:
        from_attributes = True

