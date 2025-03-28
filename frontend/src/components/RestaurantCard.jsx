import React from 'react';
import { Card, CardContent, Typography, Rating, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <CardActionArea onClick={() => navigate(`/restaurant/${restaurant.id}`)}>
                <CardContent>
                    <Typography variant="h6">{restaurant.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {restaurant.location}
                    </Typography>
                    <Rating value={restaurant.rating} precision={0.1} readOnly />
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default RestaurantCard;
