from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from app.schemas.user import UserCreate, UserLogin
from app.core.database import SessionLocal
from app.models.user import User
from app.utils.hashing import hash_password, verify_password
from app.utils.token import create_access_token
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Auth"])
security = HTTPBearer()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(400, "Email already exists")

    hashed = hash_password(user.password)
    new_user = User(name=user.name, email=user.email, phone=user.phone, password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"id": new_user.id})
    return {
        "message": "User created",
        "token": token,
        "user": {"id": new_user.id, "name": new_user.name, "email": new_user.email, "phone": new_user.phone}
    }


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(400, "Invalid credentials")

    token = create_access_token({"id": db_user.id})
    return {
        "message": "Login successful",
        "token": token,
        "user": {"id": db_user.id, "name": db_user.name, "email": db_user.email, "phone": db_user.phone}
    }


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id: int = payload.get("id")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email, "phone": current_user.phone}


@router.get("/my-bikes")
def get_my_bikes(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.vehicle import Vehicle, BikeImage
    
    base_url = str(request.base_url).rstrip("/")
    vehicles = db.query(Vehicle).filter(Vehicle.owner_id == current_user.id).all()
    
    result = []
    for v in vehicles:
        # Get images with full URL
        images = db.query(BikeImage).filter(BikeImage.bike_id == v.id).all()
        image_urls = []
        for img in images:
            url = img.image_url
            if url and (url.startswith("http://") or url.startswith("https://")):
                image_urls.append(url)
            else:
                image_urls.append(f"{base_url}/static/uploads/vehicles/{url}")
        
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
            "images": image_urls
        })
    
    return {"vehicles": result, "total": len(result)}
