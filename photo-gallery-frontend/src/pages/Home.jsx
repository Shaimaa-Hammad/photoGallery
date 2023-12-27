import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from '../config/axios';
import { RECENT_PHOTOS, API_URL, PHOTO_DETAILS, SIGNUP_URL, ALL_PHOTOS } from '../config/urls';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, setToken } from '../redux/slices/authSlice';

const Home = () => {
  const [allPhotos, setAllPhotos] = useState([]); // Store all photos initially
  const [filteredPhotos, setFilteredPhotos] = useState([]); // Store filtered photos based on search term
  const [searchTerm, setSearchTerm] = useState('');

  const token = useSelector(selectToken);

  const navigate = useNavigate(); // Use useNavigate to get the navigate function
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if the token is available in localStorage
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      dispatch(setToken(storedToken));
    }
  }, [dispatch]);

  useEffect(() => {
    // Make an HTTP request to fetch all photos
    axios.get(RECENT_PHOTOS)
      .then(response => {
        // console.log(response.data);
        // Handle the response and set the allPhotos state
        setAllPhotos(response.data);
      })
      .catch(error => {
        console.error('Error fetching photos:', error);
      });
  }, []);

  useEffect(() => {
    // Filter photos based on the search term
    if (searchTerm.trim() === '') {
      setFilteredPhotos(allPhotos); // Reset to show all recent photos
    } else {
      const filtered = allPhotos.filter(photo => photo.title.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredPhotos(filtered);
    }
  }, [searchTerm, allPhotos]);

  if (!filteredPhotos) {
    // Optional: Show a loading spinner or message while fetching data
    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress color="success" sx={{margin: 'auto', mt: 5}} />
        </Box>
    );
}

  const handleSeeMoreClick = () => {
    console.log(token);
    if (token) {
      // If token exists, navigate to AllPhotos page
      navigate(ALL_PHOTOS);
    } else {
      // If no token, navigate to SignUp page
      navigate(SIGNUP_URL);
    }
  };

  return (
    <div className="d-flex flex-column position-relative">
      <h2>Share your images with others</h2>
  
      {/* Bootstrap Search Bar */}
      <div className="input-group my-4 w-50 mx-auto">
        <input
          type="text"
          placeholder="Search for photos"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
          style={{ backgroundColor: '#b6ca6e' }}
        />
      </div>
  
      <div className="row flex-grow-1">
        {filteredPhotos.map(photo => (
          <div key={photo.id} className="col-md-3">
            <Link to={`${PHOTO_DETAILS}${photo.id}`} className="card-link" style={{ textDecoration: 'none' }}>
              <div className="card mb-3">
                <img
                  src={`${API_URL}${photo.url}`}
                  alt={photo.title}
                  className="card-img-top img-thumbnail"
                  style={{height: '5rem'}}
                />
                <div className="card-body" style={{height: '3.8rem'}}>
                  <h6 className="card-title">{photo.title}</h6>
                  {/* Add other details you want to display */}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
  
      {/* "See More" link */}
      <div className="ms-auto mt-3 mb-1">
        <button onClick={handleSeeMoreClick} className='SeeMore'>
          See More <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Home;
