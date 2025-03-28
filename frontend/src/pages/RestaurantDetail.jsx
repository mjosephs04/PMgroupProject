import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Typography,
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Button,
} from '@mui/material';

// Temporary mock data (you'd normally fetch this)
const mockRestaurants = [
    {
        id: 1,
        name: 'Pasta Palace',
        rating: 4.5,
        location: 'NYC',
        cuisine: 'Italian',
        description: 'Fresh handmade pasta and sauces.',
        reviews: [
            { id: 1, name: 'Alice', rating: 5, description: 'Absolutely loved it!' },
            { id: 2, name: 'Bob', rating: 4, description: 'Great food, decent service.' },
        ],
    },
    {
        id: 2,
        name: 'Burger Barn',
        rating: 4.2,
        location: 'Austin',
        cuisine: 'American',
        description: 'Gourmet burgers and loaded fries.',
        reviews: [
            { id: 1, name: 'Charlie', rating: 4.5, description: 'Juicy burgers!' },
            { id: 2, name: 'Dana', rating: 4, description: 'Tasty but a bit greasy.' },
        ],
    },
];

const RestaurantDetail = () => {
    const { id } = useParams();
    const restaurant = mockRestaurants.find((r) => r.id === parseInt(id));
    const [sortOrder, setSortOrder] = useState('desc');

    if (!restaurant) {
        return <Typography>Restaurant not found.</Typography>;
    }

    const sortedReviews = [...restaurant.reviews].sort((a, b) =>
        sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating
    );

    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                {restaurant.name}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Location: {restaurant.location}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Cuisine: {restaurant.cuisine}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Description: {restaurant.description}
            </Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
                <Typography variant="h6">Ratings & Reviews</Typography>
                <Button variant="outlined" onClick={toggleSortOrder}>
                    Sort by Rating: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
                </Button>
            </Box>

            <Paper elevation={2} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Rating</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedReviews.map((review) => (
                            <TableRow key={review.id}>
                                <TableCell>{review.rating}</TableCell>
                                <TableCell>{review.name}</TableCell>
                                <TableCell>{review.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default RestaurantDetail;
