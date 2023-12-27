import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';
import { API_URL, ALL_PHOTOS, PHOTO_DETAILS } from '../config/urls';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const AllPhotos = () => {
    const [allPhotos, setAllPhotos] = useState([]); // Store all photos initially
    const [filteredPhotos, setFilteredPhotos] = useState([]); // Store filtered photos based on search term
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Make an HTTP request to fetch all photos
        axios.get(ALL_PHOTOS) // Replace with the correct endpoint for fetching all photos
            .then(response => {
                console.log(response.data);
                // Handle the response and set the allPhotos state
                setAllPhotos(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching all photos:', error);
            });
    }, []);

    useEffect(() => {
        // Filter photos based on the search term
        if (searchTerm.trim() === '') {
            setFilteredPhotos(allPhotos); // Reset to show all photos
        } else {
            const filtered = allPhotos.filter(photo => photo.title.toLowerCase().includes(searchTerm.toLowerCase()));
            setFilteredPhotos(filtered);
        }
    }, [searchTerm, allPhotos]);

    if (!allPhotos) {
        // Optional: Show a loading spinner or message while fetching data
        return (
            <Box sx={{ display: 'flex' }}>
                <CircularProgress color="success" sx={{margin: 'auto', mt: 5}} />
            </Box>
        );
    }

    return (
        <div>
            {/* Bootstrap Search Bar */}
            <div className="input-group mb-3 mt-1 w-50 mx-auto position-sticky top-0 bg-white" style={{ zIndex: 1000 }}>
                <input
                    type="text"
                    placeholder="Search for photos"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control"
                    style={{ backgroundColor: '#b6ca6e' }}
                />
            </div>

            <div className="row Cards">
                {filteredPhotos.map(photo => (
                    <div key={photo.id} className="col-md-3">
                        <Link to={`${PHOTO_DETAILS}${photo.id}`} className="card-link" style={{ textDecoration: 'none' }}>
                            <div className="card mb-3">
                                <img
                                    src={`${API_URL}${photo.url}`}
                                    alt={photo.title}
                                    className="card-img-top img-thumbnail"
                                    style={{ height: '5rem' }}
                                />
                                <div className="card-body" style={{ height: '3.8rem' }}>
                                    <h6 className="card-title">{photo.title}</h6>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllPhotos;
