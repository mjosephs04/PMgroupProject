import React, { useState } from 'react';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    TextField,
    MenuItem,
    Box,
    Button,
    Modal,
    Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const [restaurants, setRestaurants] = useState([
        {
            id: 1,
            name: 'Pasta Palace',
            rating: 4.5,
            location: 'NYC',
            cuisine: 'Italian',
            description: 'Fresh handmade pasta and sauces.',
        },
        {
            id: 2,
            name: 'Burger Barn',
            rating: 4.2,
            location: 'Austin',
            cuisine: 'American',
            description: 'Gourmet burgers and loaded fries.',
        },
        {
            id: 3,
            name: 'Taco Town',
            rating: 4.0,
            location: 'NYC',
            cuisine: 'Mexican',
            description: 'Authentic street tacos with a twist.',
        },
        {
            id: 4,
            name: 'Sushi Central',
            rating: 4.8,
            location: 'Austin',
            cuisine: 'Japanese',
            description: 'Premium sushi and sashimi experience.',
        },
    ]);

    const allLocations = ['NYC', 'Austin', 'Chicago', 'San Francisco', 'Seattle'];
    const allCuisines = ['Italian', 'American', 'Mexican', 'Japanese', 'Indian', 'Thai'];

    const [locationFilter, setLocationFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [cuisineFilter, setCuisineFilter] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();


    const [newRestaurant, setNewRestaurant] = useState({
        name: '',
        location: '',
        cuisine: '',
        description: '',
    });

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => {
        setOpenModal(false);
        setNewRestaurant({ name: '', location: '', cuisine: '', description: '' });
    };

    const handleAddRestaurant = () => {
        const { name, location, cuisine, description } = newRestaurant;
        if (!name || !location || !cuisine || !description) {
            alert('Please fill in all fields.');
            return;
        }

        const nextId = restaurants.length + 1;
        const restaurantToAdd = {
            id: nextId,
            name,
            location,
            cuisine,
            description,
            rating: 0,
        };
        setRestaurants([...restaurants, restaurantToAdd]);
        handleClose();
    };

    const formIsValid =
        newRestaurant.name.trim() &&
        newRestaurant.location &&
        newRestaurant.cuisine &&
        newRestaurant.description.trim();


    const filteredRestaurants = restaurants.filter(
        (r) =>
            (locationFilter ? r.location === locationFilter : true) &&
            (ratingFilter !== '' ? r.rating >= parseFloat(ratingFilter) : true) &&
            (cuisineFilter ? r.cuisine === cuisineFilter : true)
    );

    const uniqueLocations = allLocations;
    const uniqueCuisines = allCuisines;

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Top Restaurants
            </Typography>

            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <TextField
                    select
                    label="Filter by Location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    size="small"
                    style={{ minWidth: 180 }}
                >
                    <MenuItem value="">All Locations</MenuItem>
                    {uniqueLocations.map((loc) => (
                        <MenuItem key={loc} value={loc}>
                            {loc}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Filter by Cuisine"
                    value={cuisineFilter}
                    onChange={(e) => setCuisineFilter(e.target.value)}
                    size="small"
                    style={{ minWidth: 180 }}
                >
                    <MenuItem value="">All Cuisines</MenuItem>
                    {uniqueCuisines.map((cuisine) => (
                        <MenuItem key={cuisine} value={cuisine}>
                            {cuisine}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Min Rating"
                    type="number"
                    inputProps={{ min: 0, max: 5, step: 0.1 }}
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    size="small"
                    style={{ minWidth: 150 }}
                />

                <Button variant="contained" onClick={handleOpen}>
                    Add Restaurant
                </Button>
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Rating</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Cuisine</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {filteredRestaurants.map((restaurant) => (
                        <TableRow
                            key={restaurant.id}
                            hover
                            sx={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                        >
                            <TableCell>{restaurant.name}</TableCell>
                            <TableCell>{restaurant.rating}</TableCell>
                            <TableCell>{restaurant.location}</TableCell>
                            <TableCell>{restaurant.cuisine}</TableCell>
                        </TableRow>
                    ))}
                    {filteredRestaurants.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                No matching restaurants found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Modal */}
            <Modal open={openModal} onClose={handleClose}>
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Typography variant="h6">Add Restaurant</Typography>
                    <TextField
                        required
                        label="Restaurant Name"
                        value={newRestaurant.name}
                        onChange={(e) =>
                            setNewRestaurant({ ...newRestaurant, name: e.target.value })
                        }
                    />

                    <TextField
                        required
                        select
                        label="Location"
                        value={newRestaurant.location}
                        onChange={(e) =>
                            setNewRestaurant({ ...newRestaurant, location: e.target.value })
                        }
                    >
                        {uniqueLocations.map((loc) => (
                            <MenuItem key={loc} value={loc}>
                                {loc}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        required
                        select
                        label="Cuisine"
                        value={newRestaurant.cuisine}
                        onChange={(e) =>
                            setNewRestaurant({ ...newRestaurant, cuisine: e.target.value })
                        }
                    >
                        {uniqueCuisines.map((cuisine) => (
                            <MenuItem key={cuisine} value={cuisine}>
                                {cuisine}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        required
                        label="Description"
                        multiline
                        rows={3}
                        value={newRestaurant.description}
                        onChange={(e) =>
                            setNewRestaurant({ ...newRestaurant, description: e.target.value })
                        }
                    />

                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button onClick={handleClose} sx={{ mr: 1 }}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleAddRestaurant}
                            disabled={!formIsValid}
                        >
                            Add
                        </Button>
                    </Box>
                </Paper>
            </Modal>
        </>
    );
};

export default Home;
