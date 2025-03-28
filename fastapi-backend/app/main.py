from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from . import models, schemas, database
from .database import SessionLocal, engine
from .database import Base
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware


models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (can restrict to specific domains)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods 
    allow_headers=["*"],  # Allows all headers
)


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
    # Find the restaurant
    restaurant = db.query(models.Restaurant).filter(models.Restaurant.id == restaurant_id).first()
    
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    # Get the reviews for the restaurant
    reviews = db.query(models.Review).filter(models.Review.restaurant_id == restaurant_id).all()
    
    # Ensure that an empty list is returned if no reviews exist
    return reviews if reviews else []




# POST /api/add-restaurant
@app.post("/api/add-restaurant", status_code=201)
def add_restaurant(restaurant: schemas.RestaurantCreate, db: Session = Depends(get_db)):
    new_restaurant = models.Restaurant(
        name=restaurant.name,
        location=restaurant.location,
        cuisine=restaurant.cuisine,
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

# GET /api/get-restaurant/{restaurantId}
@app.get("/api/get-restaurant/{restaurant_id}", response_model=schemas.RestaurantOut)
def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = db.query(models.Restaurant).filter(models.Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return restaurant

