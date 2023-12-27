import React, { useEffect, useState } from 'react';
import axios from '../config/axios';
import { API_URL, ME_URL } from '../config/urls';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, setToken } from '../redux/slices/authSlice';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const token = useSelector(selectToken);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#b6ca6e',
      },
    },
  });

  const dispatch = useDispatch();

  useEffect(() => {
    // Check if the token is available in localStorage
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      dispatch(setToken(storedToken));
    }
  }, [dispatch]);  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;

        const response = await axios.get(ME_URL);
        console.log(response.data);
        setUserData(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [token]);

  if (!userData) {
    return (
      <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CircularProgress sx={{margin: 'auto', mt: 5}} />
      </Box>
      </ThemeProvider>
    );
  }

  return (
    <div className='mt-5' style={{ textAlign: 'center'}}>
      {userData.profilePicture && (
        <img
        src={`${API_URL}${userData.profilePicture}`}
        alt="Profile"
          style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '10px' }}
        />
      )}
      <p style={{color: 'white'}}>{userData.name}</p>
    </div>
  );
};

export default UserProfile;
