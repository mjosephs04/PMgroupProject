import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

const RestaurantDetail = () => {
    const { id } = useParams(); // Get restaurant ID from URL params
    const [restaurant, setRestaurant] = useState(null); // State for storing restaurant review data
    const [restaurantInfo, setRestaurantInfo] = useState(null); // State for storing restaurant review data
    const [sortOrder, setSortOrder] = useState('desc'); // State for sorting reviews
    const [openDialog, setOpenDialog] = useState(false); // State to control the review dialog
    const [newReview, setNewReview] = useState({ name: '', rating: '', description: '' }); // State for new review data

    // Fetch the restaurant data based on the id
    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/get-ratings/${id}`);
                setRestaurant(response.data); // Store the fetched restaurant data
            } catch (error) {
                console.error('Error fetching restaurant:', error);
            }

            try{
            const restaurantResponse = await axios.get(`http://127.0.0.1:8000/api/get-restaurant/${id}`);
            setRestaurantInfo(restaurantResponse.data); // Store the restaurant details
            } catch (error) {
            console.error('Error fetching restaurant:', error);
            }

        };

        fetchRestaurant();
    }, [id]); // Re-run this effect when the id changes


    if (!restaurant) {
        return <Typography>Restaurant not found.</Typography>;
    }

    // Safely check for reviews (ensure it's an array)
    const reviews = Array.isArray(restaurant.reviews) ? restaurant.reviews : [];

    const sortedReviews = [...reviews].sort((a, b) =>
        sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating
    );

    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    const handleReviewDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleReviewDialogClose = () => {
        setOpenDialog(false);
    };

    const handleReviewSubmit = async () => {
        try {
            // Send POST request to add a new review
            const response = await axios.post(`http://127.0.0.1:8000/api/add-rating/${id}`, {
                rating: newReview.rating,
                comment: newReview.description,
                name: newReview.name,
            });
            console.log('Review added:', response.data);
            // Close the dialog and refresh the restaurant data
            setOpenDialog(false);
            setNewReview({ name: '', rating: '', description: '' });
            // Fetch the latest data
            const responseData = await axios.get(`http://127.0.0.1:8000/api/get-ratings/${id}`);
            setRestaurant(responseData.data);
        } catch (error) {
            console.error('Error adding review:', error);
        }
    };

    return (
        <Box p={3}>
        {restaurantInfo ? (
            <>
                <Typography variant="h4" gutterBottom>
                    {restaurantInfo.name}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Location: {restaurantInfo.location}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Cuisine: {restaurantInfo.cuisine}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Description: {restaurantInfo.description}
                </Typography>
            </>
        ) : (
            <Typography>Loading restaurant information...</Typography> // Show loading message while data is being fetched
        )}

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
                <Typography variant="h6">Ratings & Reviews</Typography>
                <Button variant="outlined" onClick={toggleSortOrder}>
                    Sort by Rating: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
                </Button>
                <Button variant="contained" color="primary" onClick={handleReviewDialogOpen}>
                    Add Review
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
                        {sortedReviews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3}>No reviews yet.</TableCell>
                            </TableRow>
                        ) : (
                            sortedReviews.map((review) => (
                                <TableRow key={review.id}>
                                    <TableCell>{review.rating}</TableCell>
                                    <TableCell>{review.name}</TableCell>
                                    <TableCell>{review.comment}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Paper>

            {/* Add Review Dialog */}
            <Dialog open={openDialog} onClose={handleReviewDialogClose}>
                <DialogTitle>Add Review</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Rating"
                        type="number"
                        fullWidth
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={newReview.description}
                        onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleReviewDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleReviewSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RestaurantDetail;
