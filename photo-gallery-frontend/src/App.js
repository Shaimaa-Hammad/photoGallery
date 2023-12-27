import { useState, useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import PhotoDetails from './pages/photoDetails';
import AllPhotos from './pages/allPhotos';
import SignUp from './pages/signUp';
import SignIn from './pages/signIn';
import { ALL_PHOTOS, PHOTO_DETAILS, SIGNIN_URL, SIGNUP_URL, USER_PHOTOS } from './config/urls';
import UserProfile from './pages/userProfile';
import { Button, Box, CircularProgress } from '@mui/material';
import Error from './pages/error';
import UserPhotos from './pages/userPhotos';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { selectToken, clearToken, clearLoggedUserId, setToken } from './redux/slices/authSlice';
import UserPhotoManagement from './pages/userPhotoManagement';


function App() {
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    // Check if the token is available in localStorage
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      dispatch(setToken(storedToken));
    }
    setAuthLoaded(true);
  }, [dispatch]);

  const logOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('loggedUserId');
    dispatch(clearToken());
    dispatch(clearLoggedUserId());
  }

  if (!authLoaded) {
    // Optional: Show a loading indicator while authentication status is being loaded
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress color="success" sx={{margin: 'auto', mt: 5}} />
      </Box>
    );
  }

  return (
    <Provider store={store}>
    <BrowserRouter>
      <div className='Body'>
        <div className='container-lg'>
          <div className='row Main my-5'>
            <div className='col-3' style={{ backgroundColor: '#0b0e09' }}>
              {token && <UserProfile />}
             { token ? <><Button component={Link} to={USER_PHOTOS} fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, bgcolor: '#172c05', '&:hover': { bgcolor: '#b6ca6e' } }}>
                Manage your photos
              </Button>
             <Button component={Link} to={ALL_PHOTOS} fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, bgcolor: '#172c05', '&:hover': { bgcolor: '#b6ca6e' } }}>
                Show all photos
              </Button>
              <Button onClick={logOut} component={Link} to='/' fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, bgcolor: '#172c05', '&:hover': { bgcolor: '#b6ca6e' } }}>
                Sign out
              </Button></> : <div><Button component={Link} to={SIGNUP_URL} fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, bgcolor: '#172c05', '&:hover': { bgcolor: '#b6ca6e' } }}>
                Sign up
              </Button>
              <Button component={Link} to={SIGNIN_URL} fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, bgcolor: '#172c05', '&:hover': { bgcolor: '#b6ca6e' } }}>
                Sign in
              </Button></div>}
            </div>
            <div className='col-9 RightColumn pt-3'>
              <Routes>
                <Route exact path="/" element={<Home></Home>} />
                <Route path={`${PHOTO_DETAILS}:id`} element={<PhotoDetails></PhotoDetails>} />
                {token ? <Route path={ALL_PHOTOS} element={<AllPhotos></AllPhotos>} /> : <Route path={ALL_PHOTOS} element={<Error />} />}
                <Route path={SIGNUP_URL} element={<SignUp />} />
                <Route path={SIGNIN_URL} element={<SignIn />} />
                <Route path={USER_PHOTOS} element={<UserPhotos />} />
                <Route path={`${PHOTO_DETAILS}:id/manage`} element={<UserPhotoManagement />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
