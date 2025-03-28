from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from . import models, schemas, database
from .database import SessionLocal, engine
from .database import Base
from fastapi.responses import JSONResponse

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# POST /api/add-rating/{restaurantId}
@app.post("/api/add-rating/{restaurant_id}", status_code=201)
def add_rating(restaurant_id: int, review: schemas.ReviewBase, db: Session = Depends(get_db)):
    print("Incoming review:", review)
    print("Looking for restaurant with id:", restaurant_id)

    restaurant = db.query(models.Restaurant).filter(models.Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    new_review = models.Review(
        restaurant_id=restaurant_id,
        rating=review.rating,
        comment=review.comment
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return {"message": "Review added successfully!"}



# GET /api/get-ratings/{restaurantId}
@app.get("/api/get-ratings/{restaurant_id}", response_model=list[schemas.ReviewOut])
def get_ratings(restaurant_id: int, db: Session = Depends(get_db)):
    reviews = db.query(models.Review).filter(models.Review.restaurant_id == restaurant_id).all()
    return reviews


# POST /api/add-restaurant
@app.post("/api/add-restaurant", status_code=201)
def add_restaurant(restaurant: schemas.RestaurantCreate, db: Session = Depends(get_db)):
    new_restaurant = models.Restaurant(
        name=restaurant.name,
        location=restaurant.location,
        cuisine_type=restaurant.cuisine_type,
        description=restaurant.description
    )
    db.add(new_restaurant)
    db.commit()
    db.refresh(new_restaurant)
    return {"message": "Restaurant added successfully!", "restaurant_id": new_restaurant.id}


# GET /api/get-all-restaurants
@app.get("/api/get-all-restaurants", response_model=list[schemas.RestaurantOut])
def get_all_restaurants(db: Session = Depends(get_db)):
    restaurants = db.query(models.Restaurant).all()
    return restaurants
