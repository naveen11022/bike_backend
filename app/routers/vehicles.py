from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, Request
from sqlalchemy.orm import Session
from app.models.vehicle import Vehicle, BikeImage
from app.schemas.vehicle import VehicleCreate, VehicleOut
from app.core.database import SessionLocal
from app.routers.auth import get_current_user
from app.models.user import User
from typing import Optional, List
import os

router = APIRouter(prefix="/vehicles", tags=["Vehicles"], redirect_slashes=False)

UPLOAD_DIR = "app/static/uploads/vehicles"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_image_urls(db: Session, vehicle_id: int, base_url: str):
    images = db.query(BikeImage).filter(BikeImage.bike_id == vehicle_id).all()
    result = []
    for img in images:
        url = img.image_url
        if url and (url.startswith("http://") or url.startswith("https://")):
            result.append(url)
        else:
            result.append(f"{base_url}/static/uploads/vehicles/{url}")
    return result


# ------------------------------------------
# STATIC ROUTES FIRST  (important!)
# ------------------------------------------

@router.get("/brands/list")
def get_brands(db: Session = Depends(get_db)):
    brands = db.query(Vehicle.brand).distinct().all()
    return [b[0] for b in brands if b[0]]


@router.get("/my-bikes/")
def get_my_bikes(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    base_url = str(request.base_url).rstrip("/")
    vehicles = db.query(Vehicle).filter(Vehicle.owner_id == current_user.id).all()
    
    result = []
    for v in vehicles:
        images = get_image_urls(db, v.id, base_url)
        result.append({
            "id": v.id,
            "title": v.title,
            "brand": v.brand,
            "model": v.model,
            "price": v.price,
            "year": v.year,
            "km_driven": v.km_driven,
            "fuel_type": v.fuel_type,
            "location": v.location,
            "description": v.description,
            "owner_id": v.owner_id,
            "images": images
        })
    
    return {"vehicles": result, "total": len(result)}


@router.post("/")
def create_vehicle(
    vehicle: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_vehicle = Vehicle(**vehicle.dict(), owner_id=current_user.id)
    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)
    return {"id": new_vehicle.id, "message": "Vehicle created successfully"}


@router.get("/")
def get_all_vehicles(
    request: Request,
    db: Session = Depends(get_db),
    brand: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50)
):
    base_url = str(request.base_url).rstrip("/")
    query = db.query(Vehicle)
    
    if brand:
        query = query.filter(Vehicle.brand.ilike(f"%{brand}%"))
    if min_price is not None:
        query = query.filter(Vehicle.price >= min_price)
    if max_price is not None:
        query = query.filter(Vehicle.price <= max_price)
    if search:
        query = query.filter(
            (Vehicle.model.ilike(f"%{search}%")) | 
            (Vehicle.title.ilike(f"%{search}%"))
        )
    
    total = query.count()
    vehicles = query.offset((page - 1) * limit).limit(limit).all()
    
    result = []
    for v in vehicles:
        images = get_image_urls(db, v.id, base_url)
        result.append({
            "id": v.id,
            "title": v.title,
            "brand": v.brand,
            "model": v.model,
            "price": v.price,
            "year": v.year,
            "km_driven": v.km_driven,
            "fuel_type": v.fuel_type,
            "location": v.location,
            "description": v.description,
            "owner_id": v.owner_id,
            "images": images
        })
    
    return {"vehicles": result, "total": total, "page": page, "pages": (total + limit - 1) // limit}


# ------------------------------------------
# DYNAMIC ROUTES AFTER STATIC ROUTES
# ------------------------------------------

@router.get("/{vehicle_id}")
def get_vehicle(vehicle_id: int, request: Request, db: Session = Depends(get_db)):
    base_url = str(request.base_url).rstrip("/")
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    owner = db.query(User).filter(User.id == vehicle.owner_id).first()
    images = get_image_urls(db, vehicle.id, base_url)
    
    return {
        "id": vehicle.id,
        "title": vehicle.title,
        "brand": vehicle.brand,
        "model": vehicle.model,
        "price": vehicle.price,
        "year": vehicle.year,
        "km_driven": vehicle.km_driven,
        "fuel_type": vehicle.fuel_type,
        "location": vehicle.location,
        "description": vehicle.description,
        "owner_id": vehicle.owner_id,
        "images": images,
        "owner": {
            "name": owner.name if owner else None,
            "email": owner.email if owner else None,
            "phone": owner.phone if owner else None
        }
    }


@router.put("/{vehicle_id}")
def update_vehicle(
    vehicle_id: int,
    vehicle_data: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    if vehicle.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only edit your own bikes")
    
    for key, value in vehicle_data.dict().items():
        setattr(vehicle, key, value)
    
    db.commit()
    db.refresh(vehicle)
    return {"message": "Vehicle updated successfully"}


@router.post("/{vehicle_id}/upload-images")
async def upload_vehicle_images(
    vehicle_id: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    if not vehicle:
        raise HTTPException(404, "Vehicle not found")
    
    if vehicle.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only upload images to your own bikes")

    saved_images = []

    for file in files:
        clean_filename = file.filename.replace(" ", "_")
        filename = f"{vehicle_id}_{clean_filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)

        contents = await file.read()
        with open(filepath, "wb") as buffer:
            buffer.write(contents)

        img = BikeImage(bike_id=vehicle_id, image_url=filename)
        db.add(img)
        saved_images.append(filename)

    db.commit()

    return {"message": "Images uploaded successfully", "images": saved_images}


@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    if vehicle.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own bikes")

    images = db.query(BikeImage).filter(BikeImage.bike_id == vehicle_id).all()

    for img in images:
        file_path = os.path.join(UPLOAD_DIR, img.image_url)
        if os.path.exists(file_path):
            os.remove(file_path)
        db.delete(img)

    db.delete(vehicle)
    db.commit()

    return {"message": "Vehicle deleted successfully"}
