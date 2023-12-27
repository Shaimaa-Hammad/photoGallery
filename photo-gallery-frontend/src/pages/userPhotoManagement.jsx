import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { PHOTO_DETAILS, API_URL, USER_PHOTOS } from '../config/urls';
import { useParams, useNavigate } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, TextField, Modal, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, setToken } from '../redux/slices/authSlice';

const UserPhotoManagement = () => {
    const { id } = useParams(); // Get the photo ID from the route parameters
    const [photoDetails, setPhotoDetails] = useState(null);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedCaption, setUpdatedCaption] = useState('');
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

    const token = useSelector(selectToken);

    const dispatch = useDispatch();

    const navigate = useNavigate();

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

    useEffect(() => {
        // Check if the token is available in localStorage
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
          dispatch(setToken(storedToken));
        }
      }, [dispatch]);

    useEffect(() => {
        // Make an HTTP request to fetch details of the chosen photo
        axios.get(`${PHOTO_DETAILS}${id}`)
            .then(response => {
                setPhotoDetails(response.data.data); // Assuming the API response contains photo details
            })
            .catch(error => {
                console.error('Error fetching photo details:', error);
            });
    }, [id]);

    if (!photoDetails) {
        // Optional: Show a loading spinner or message while fetching data
        return (
            <Box sx={{ display: 'flex' }}>
                <CircularProgress color="success" sx={{margin: 'auto', mt: 5}} />
            </Box>
        );
    }

    const handleOpenUpdateModal = () => {
        setOpenUpdateModal(true);
    }

    const handleCloseUpdateModal = () => {
        setOpenUpdateModal(false);
    }

    const handleChange = (e) => {
        // Update the state based on input changes
        if (e.target.name === 'title') {
            setUpdatedTitle(e.target.value);
        } else if (e.target.name === 'caption') {
            setUpdatedCaption(e.target.value);
        }
    }

    const handleUpdate = async () => {
        try {
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            await axios.put(`${PHOTO_DETAILS}${id}`, { title: updatedTitle, caption: updatedCaption });
            setOpenUpdateModal(false);
            // Fetch updated photo details after the update
            const updatedDetails = await axios.get(`${PHOTO_DETAILS}${id}`);
            setPhotoDetails(updatedDetails.data.data);
        } catch (error) {
            console.error('Error updating photo:', error.response); // Log the response for more details
        }
    }

    const handleOpenConfirmDeleteDialog = () => {
        setConfirmDeleteDialogOpen(true);
    }

    const handleCloseConfirmDeleteDialog = () => {
        setConfirmDeleteDialogOpen(false);
    }

    const handleDeleteConfirmed = async () => {
        handleCloseConfirmDeleteDialog();

        navigate(USER_PHOTOS);
        
        try {
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            await axios.delete(`${PHOTO_DETAILS}${id}`);
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    }

    return (
        <div>
            <h2>
                {photoDetails.title}
                {photoDetails.totalRate ? (
                    <Rating value={photoDetails.totalRate} precision={0.5} readOnly sx={{ marginLeft: '0.75rem' }} />
                ) : null}
            </h2>
            <img
                src={`${API_URL}${photoDetails.url}`}
                alt={photoDetails.title}
                style={{ maxWidth: '100%', maxHeight: '400px' }}
            />
            {photoDetails.caption ? <p>{photoDetails.caption}</p> : null}
            <div style={{ width: '50%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: 'auto', marginTop: '2rem', marginBottom: '2rem' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenUpdateModal}
                    sx={{ bgcolor: '#172c05', '&:hover': { bgcolor: '#b6ca6e' } }}
                >
                    Update
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ bgcolor: '#172c05', '&:hover': { bgcolor: '#b6ca6e' } }}
                    onClick={handleOpenConfirmDeleteDialog}
                >
                    Delete
                </Button>
            </div>

            {openUpdateModal && <Modal
                    open={openUpdateModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            <strong>Update</strong>
                        </Typography>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Title"
                            name="title"
                            value={updatedTitle}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Caption"
                            name="caption"
                            value={updatedCaption}
                            onChange={handleChange}
                        />
                        <Button onClick={handleUpdate} sx={{ mt: 2 }}>Update</Button>
                        <Button onClick={handleCloseUpdateModal} sx={{ mt: 2 }}>Cancel</Button>
                    </Box>
                </Modal>}

                {confirmDeleteDialogOpen && (
                <Modal
                    open={confirmDeleteDialogOpen}
                    aria-labelledby="confirm-delete-modal-title"
                    aria-describedby="confirm-delete-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="confirm-delete-modal-title" variant="h6" component="h2">
                            Are you sure you want to delete this photo?
                        </Typography>
                        <Button onClick={handleDeleteConfirmed} sx={{ mt: 2 }}>Delete</Button>
                        <Button onClick={handleCloseConfirmDeleteDialog} sx={{ mt: 2 }}>Cancel</Button>
                    </Box>
                </Modal>
            )}
        </div>
    );
};

export default UserPhotoManagement;
