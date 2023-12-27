import React, { useState } from 'react';
import axios from '../config/axios';
import { ALL_PHOTOS, SIGNIN_URL, SIGNUP_URL } from '../config/urls';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, CssBaseline, Avatar, Box, Modal } from '@mui/material';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import { useDispatch } from 'react-redux';
import { setLoggedUserId, setToken } from '../redux/slices/authSlice';

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#b6ca6e',
        border: '2px solid #172c05',
        boxShadow: 24,
        p: 4,
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (formData.password !== formData.confirmPassword) {
            setError('Password and confirmation do not match');
            setOpenModal(true);
            return;
        }

        try {
            const response = await axios.post(SIGNIN_URL, { email: formData.email, password: formData.password });
            localStorage.setItem('accessToken', response.data.data.accessToken);
            dispatch(setToken(response.data.data.accessToken));
            // console.log(response.data.data);
            localStorage.setItem('loggedUserId', response.data.data.id)
            dispatch(setLoggedUserId(response.data.data.id));
            navigate(ALL_PHOTOS);

        } catch (e) {
            console.log(e);
            if (e.response.status === 401) {
                setError(e.response.data.message);
                setOpenModal(true);
            }
            console.error(e);
        }
    };

    const handleClose = () => setOpenModal(false);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '5%',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: '#172c05' }}>
                    <LoginOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2, bgcolor: '#172c05', '&:hover': { bgcolor: '#b6ca6e' } }}
                    >
                        Sign In
                    </Button>
                </form>
                {error && <Modal
                    open={openModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: 'red' }}>
                            <strong>Error</strong>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: '18px' }}>
                            {error}
                        </Typography>
                        <Button onClick={handleClose} sx={{ mt: 2 }}>Try again!</Button>
                    </Box>
                </Modal>}
            </div>
            <Typography component="h6" variant="subtitle1" align="center" sx={{ mt: 2 }}>
                Don't have an account? <Link style={{ color: '#172c05', paddingLeft: '0.5rem' }} to={SIGNUP_URL}>Sign up</Link>
            </Typography>
        </Container>
    );
};

export default SignIn;
