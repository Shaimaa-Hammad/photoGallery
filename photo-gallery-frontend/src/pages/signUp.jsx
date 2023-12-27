import React, { useState } from 'react';
import axios from '../config/axios';
import { ALL_PHOTOS, SIGNIN_URL, SIGNUP_URL } from '../config/urls';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, CssBaseline, Avatar, InputLabel, FormControl, Box, Modal } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useDispatch } from 'react-redux';
import { setLoggedUserId, setToken } from '../redux/slices/authSlice';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        profilePicture: null,
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
        const { name, value, type } = e.target;

        // If the field is a file, use e.target.files[0], else use the value directly
        const fieldValue = type === 'file' ? e.target.files[0] : value;

        // Update the formData with the new value
        setFormData((prevData) => ({
            ...prevData,
            [name]: fieldValue,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('profilePicture', formData.profilePicture);

            // Send a POST request to the server
            await axios.post(SIGNUP_URL, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Reset the form data and provide feedback to the user
            setFormData({
                name: '',
                email: '',
                password: '',
                profilePicture: null,
            });

            // Sign user in after successful registration
            try {
                const signInResponse = await axios.post(SIGNIN_URL, { email: formData.email, password: formData.password });
                localStorage.setItem('accessToken', signInResponse.data.data.accessToken);
                dispatch(setToken(signInResponse.data.data.accessToken));
                localStorage.setItem('loggedUserId', signInResponse.data.data.id)
                dispatch(setLoggedUserId(signInResponse.data.data.id));
                navigate(ALL_PHOTOS);

            } catch (e) {
                if (e.response.status === 401)
                    setError(e.response.data.message);
                console.error(e);
            }

        } catch (error) {
            if (error.response.status === 400) {
                setError(error.response.data.message);
                setOpenModal(true);
            }
            console.error(error);
        }
    };

    const handleClose = () => setOpenModal(false);

    return (
        <>
            <h2>To see more photos, please sign up!</h2>
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
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
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
                        <FormControl fullWidth>
                            <InputLabel htmlFor="profilePictureInput">Profile Picture</InputLabel>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                name="profilePicture"
                                type="file"
                                id="profilePictureInput"
                                onChange={handleChange}
                                sx={{ mt: 5 }}
                            />
                        </FormControl>
                        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, bgcolor: '#172c05', '&:hover': { bgcolor: '#b6ca6e' } }}
                        >
                            Sign Up
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
            </Container>
            <h6>Already have an account?
                <Link to={SIGNIN_URL} style={{ color: '#172c05', paddingLeft: '0.5rem' }}>Sign in</Link>
            </h6>
        </>
    );
};

export default SignUp;