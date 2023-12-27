import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios';
import { USER_PHOTOS, PHOTO_DETAILS, API_URL, UPLOAD_PHOTO } from '../config/urls';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, Modal, Typography, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, setToken } from '../redux/slices/authSlice';

const UserPhotos = () => {
    const [userPhotos, setUserPhotos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [openErrorModal, setOpenErrorModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [newPhotoTitle, setNewPhotoTitle] = useState('');
    const [error, setError] = useState('');

    const token = useSelector(selectToken);

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

    useEffect(() => {
        // Check if the token is available in localStorage
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            dispatch(setToken(storedToken));
        }
    }, [dispatch]);

    useEffect(() => {
        // Fetch authenticated user's photos
        axios.get(USER_PHOTOS, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                console.log(response.data);
                setUserPhotos(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching user photos:', error);
            });
    }, [token]);

    const filteredPhotos = userPhotos.filter(photo => photo.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleUpload = () => {
        if (!selectedFile || !newPhotoTitle) {
            // Display error modal if either the file or title is empty
            setError('Photo and its title are required.');
            setSelectedFile(null);
            setNewPhotoTitle('');
            setOpenModal(false);
            setOpenErrorModal(true);
        } else {
            const formData = new FormData();
            formData.append('photo', selectedFile);
            formData.append('title', newPhotoTitle);

            axios.post(UPLOAD_PHOTO, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    setUserPhotos(prevPhotos => [...prevPhotos, response.data.data]);
                    setSelectedFile(null);
                    setNewPhotoTitle('');
                    setOpenModal(false);
                })
                .catch(error => {
                    setError(error.response.data.message);
                    setOpenModal(false);
                    setOpenErrorModal(true);
                    console.error('Error uploading photo:', error);
                });
        }
    };


    const handleTitleChange = (e) => {
        setNewPhotoTitle(e.target.value);
    };

    const handleClose = () => setOpenModal(false);

    const handleCloseError = () => setOpenErrorModal(false);

    if (!filteredPhotos) {
        // Optional: Show a loading spinner or message while fetching data
        return (
            <Box sx={{ display: 'flex' }}>
                <CircularProgress color="success" sx={{ margin: 'auto', mt: 5 }} />
            </Box>
        );
    }

    return (
        <div>
            {/* Bootstrap Search Bar */}
            <div className="input-group mb-3 mt-1 w-50 mx-auto position-sticky top-0" style={{ zIndex: 1000 }}>
                <input
                    type="text"
                    placeholder="Search for photos"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control"
                    style={{ backgroundColor: '#b6ca6e' }}
                />
                <Button onClick={() => setOpenModal(true)} fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2, bgcolor: '#172c05', '&:hover': { bgcolor: '#b6ca6e' } }}>
                    Upload new photo
                </Button>
                <Modal
                    open={openModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: '#172c05' }}>
                            <strong>Choose photo to upload</strong>
                        </Typography>
                        <TextField
                            required
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="photo"
                            type="file"
                            onChange={handleFileChange}
                            sx={{ mt: 5 }}
                        />
                        <TextField
                            required
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Title"
                            name="title"
                            value={newPhotoTitle}
                            onChange={handleTitleChange}
                            sx={{ mt: 2 }}
                        />
                        <Button onClick={handleUpload} sx={{ mt: 2 }}>Upload</Button>
                        <Button onClick={handleClose} sx={{ mt: 2 }}>Cancel</Button>
                    </Box>
                </Modal>
            </div>

            <div className="row Cards">
                {filteredPhotos.map(photo => (
                    <div key={photo.id} className="col-md-3">
                        <Link to={`${PHOTO_DETAILS}${photo.id}/manage`} className="card-link" style={{ textDecoration: 'none' }}>
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

            {error && <Modal
                open={openErrorModal}
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
                    <Button onClick={handleCloseError} sx={{ mt: 2 }}>Try again!</Button>
                </Box>
            </Modal>}
        </div>
    );
};

export default UserPhotos;
