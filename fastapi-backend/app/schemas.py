from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RestaurantBase(BaseModel):
    name: str
    location: str
    cuisine: str
    description: Optional[str] = None


class RestaurantCreate(RestaurantBase):
    pass


class RestaurantOut(RestaurantBase):
    id: int

    class Config:
        orm_mode = True


class ReviewBase(BaseModel):
    name: str
    rating: int
    comment: Optional[str] = None


class ReviewOut(ReviewBase):
    id: int
    restaurant_id: int

    class Config:
        orm_mode = True
