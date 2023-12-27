import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { PHOTO_DETAILS, API_URL } from '../config/urls';
import { useParams } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedUserId, selectToken, setLoggedUserId, setToken } from '../redux/slices/authSlice';


const PhotoDetails = () => {
    const { id } = useParams(); // Get the photo ID from the route parameters
    const [photoDetails, setPhotoDetails] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const [hasRated, setHasRated] = useState(false); // Add hasRated state
    const token = useSelector(selectToken);
    const userId = useSelector(selectLoggedUserId);

    const dispatch = useDispatch();

    useEffect(() => {
        // Check if the token is available in localStorage
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            dispatch(setToken(storedToken));
        }

        const storedLoggedUserId = localStorage.getItem('loggedUserId');
        if (storedLoggedUserId) {
            dispatch(setLoggedUserId(storedLoggedUserId));
        }
    }, [dispatch]);

    // console.log(token);

    useEffect(() => {
        // Make an HTTP request to fetch details of the chosen photo
        axios.get(`${PHOTO_DETAILS}${id}`)
            .then(response => {
                setPhotoDetails(response.data.data); // Assuming the API response contains photo details

                console.log(userId);
                console.log(response.data.data.reviews[0].user.id);
                // Set initial userRating and hasRated based on the fetched data
                const userRateIndex = response.data.data.reviews.findIndex(review => review.user.id === userId);
                if (userRateIndex > -1) {
                    setUserRating(response.data.data.reviews[userRateIndex].rate);
                    setHasRated(true);
                }
            })
            .catch(error => {
                console.error('Error fetching photo details:', error);
            });
    }, [id, userId]);

    const handleRate = async () => {
        if (userRating > 0) {
            const rateData = {
                rate: userRating,
            };

            await axios.post(`${PHOTO_DETAILS}${id}/reviews`, rateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(async (response) => {
                    setHasRated(true); // Update hasRated state immediately after successful rating

                    // Fetch updated photo details after successful rating
                    const updatedDetails = await axios.get(`${PHOTO_DETAILS}${id}`);
                    setPhotoDetails(updatedDetails.data.data);
                })
                .catch(error => {
                    console.error('Error submitting/updating rating:', error);
                });
        }
    };

    if (!photoDetails) {
        // Optional: Show a loading spinner or message while fetching data
        return (
            <Box sx={{ display: 'flex' }}>
                <CircularProgress color="success" sx={{margin: 'auto', mt: 5}} />
            </Box>
        );
    }

    return (
        <div>
            <h2>
                {photoDetails.title}
                {photoDetails.totalRate ? (
                    <Rating value={photoDetails.totalRate} precision={0.5} readOnly sx={{ marginLeft: '0.75rem' }} />
                ) : null}
            </h2>
            <h6>Uploaded by {photoDetails.owner.name}</h6>
            <img
                src={`${API_URL}${photoDetails.url}`}
                alt={photoDetails.title}
                style={{ maxWidth: '100%', maxHeight: '400px' }}
            />
            {photoDetails.caption ? <p>{photoDetails.caption}</p> : null}

            <Typography component="legend" sx={{ my: 2, fontSize: '18px' }}>Your rate</Typography>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto', marginTop: '2rem', marginBottom: '2rem' }}>
                <Rating
                    name="Your rate"
                    value={userRating} // Assume userRating is a state variable to track the user's rating
                    onChange={(event, newValue) => {
                        setUserRating(newValue); // Assume setUserRating is a function to update userRating state
                    }}
                    precision={0.5}
                />

                <Button onClick={handleRate} variant="contained" color="primary" sx={{ marginLeft: '0.75rem', bgcolor: '#172c05', '&:hover': { bgcolor: '#b6ca6e' }, fontSize: '10x' }}>
                    {hasRated ? 'Update Rating' : 'Add Rating'}
                </Button>
            </div>
        </div>
    );
};

export default PhotoDetails;
