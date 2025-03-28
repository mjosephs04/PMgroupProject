import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import Home from './pages/Home';
import RestaurantDetail from './pages/RestaurantDetail';

const App = () => {
    return (
        <Router>
            <CssBaseline />
            <Container sx={{ mt: 4 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;
