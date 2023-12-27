/**
 * Module dependencies.
 */
const Photo = require('../models/photo')
const User = require('../models/user')
const fs = require('fs'); // Node.js file system module

/**
 * Find photo by id
 * @param req 
 * @param res 
 */
exports.find = async (req, res) => {
    const { id } = req.params
    const photo = await Photo.findById(id).select('-reviews.id').populate('reviews.user', 'name')
    if (!photo) return res.status(404).send()
    res.json({
        success: true,
        data: photo
    })
}

/**
 * Find photo by authenticated owner
 * @param req 
 * @param res 
 */
// exports.getPhotosByOwner = async (req, res) => {
//     try {
//         const ownerId = req.userId;
//         console.log(ownerId);

//         // Find all photos with the specified owner's _id
//         const photos = await Photo.find({ 'owner.id': ownerId }).select('-owner');

//         res.json({
//             success: true,
//             data: photos,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal Server Error',
//         });
//     }
// };

/**
 * Upload new photo
 * @param req 
 * @param res 
 */
exports.upload = async (req, res) => {
    const { title, caption } = req.body;

    try {
        // Check if the required fields are present
        if (!title || !req.file) {
            // If the title or file is missing, delete the uploaded file (if any)
            if (req.file) {
                //Delete uploaded photo from images folder
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: 'Photo and its title are required.',
            });
        }

        const { filename, path } = req.file;
        const url = `/images/${filename}`; // Assuming the images are served from a '/images' endpoint

        const user = await User.findById(req.userId)
        // console.log(user);

        const photo = Photo({
            title, url, caption, owner: {
                id: user._id,
                name: user.name
            }
        });
        await photo.save();

        //Save uploaded photo to ownPhotos of its uploader
        const ownerId = req.userId;
        // console.log(ownerId);

        // Find all photos with the specified owner's _id
        const photos = await Photo.find({ 'owner.id': ownerId }).select('-owner');
        // console.log(photos);

        user.ownPhotos = photos.map(photo => ({ id: photo._id, title: photo.title }));
        // console.log(user.ownPhotos);

        await user.save();

        res.json({
            success: true,
            data: photo,
        });
    } catch (error) {
        fs.unlinkSync(req.file.path);
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

/**
 * Get authenticated user's photos
 * @param req 
 * @param res 
 */
exports.getOwnPhotos = async (req, res) => {
    try {
        // Assuming you have a Photo model with an 'owner' field
        const userId = req.userId;

        // Fetch photos associated with the authenticated user
        const userPhotos = await Photo.find({ 'owner.id': userId });

        res.json({
            success: true,
            data: userPhotos,
        });
    } catch (error) {
        console.error('Error fetching user photos:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong!',
        });
    }
}

/**
 * Retrieve all photos uploaded
 * @param req 
 * @param res 
 */
exports.getAllPhotos = async (req, res) => {
    try {
        // Fetch all photos
        const photos = await Photo.find();

        res.status(200).json({
            success: true,
            data: photos
        });
    } catch (error) {
        console.error('Error fetching all photos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * Retrieve the last 8 photos uploaded
 * @param req 
 * @param res 
 */
exports.getLast8Photos = async (req, res) => {
    try {
        // Find the last 8 photos based on the 'createdAt' timestamp
        const photos = await Photo.find({})
            .sort({ createdAt: -1 }) // Sort in descending order based on timestamp
            .limit(8); // Limit the result to the last 8 photos

        res.status(200).json(photos);
    } catch (error) {
        console.error('Error fetching last 8 photos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Update photo by id
 * @param req 
 * @param res 
 */
exports.update = async (req, res) => {
    const { id } = req.params;
    const { title, caption } = req.body;

    try {
        const photo = await Photo.findById(id);

        // Check if the photo exists
        if (!photo) {
            return res.status(404).json({
                success: false,
                message: 'Photo not found.',
            });
        }

        // Check if the user is the owner of the photo
        if (photo.owner.id.toString() !== req.userId.toString()) {
            // console.log('Owner:', photo.owner);
            // console.log('Requesting User:', req.userId);

            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this photo.',
            });
        }

        // Update the photo
        await Photo.updateOne(
            { _id: id },
            {
                $set: {
                    title, caption
                }
            }
        );

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

/**
 * Delete photo by id
 * @param req 
 * @param res 
 */
exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        const photo = await Photo.findById(id);

        // Check if the photo exists
        if (!photo) {
            return res.status(404).json({
                success: false,
                message: 'Photo not found.',
            });
        }

        // Check if the user is the owner of the photo
        if (photo.owner.id.toString() !== req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this photo.',
            });
        }

        // Delete the photo
        await Photo.deleteOne({ _id: id });
        fs.unlinkSync(req.file.path);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

/**
 * Photos pagination
 * @param req 
 * @param res 
 */



/**
 * Add photo review/rate
 * @param req 
 * @param res 
 */
exports.addRate = async (req, res) => {
    const { id } = req.params
    const { rate } = req.body

    const photo = await Photo.findById(id).select('-reviews._id')
    if (!photo) return res.status(404).send()

    const isRated = photo.reviews.findIndex(ph => ph.user == req.userId)

    if (isRated > -1) {
        // If the user has already rated, update the existing rate
        const totalRateWithoutUser = (photo.totalRate * photo.reviews.length) - photo.reviews[isRated].rate;
        const newTotalRate = (totalRateWithoutUser + rate) / photo.reviews.length;
        // console.log("Old Rate: ", photo.reviews[isRated].rate);
        // console.log("Total Rate Without User: ", totalRateWithoutUser);
        // console.log("Number of Reviews: ", photo.reviews.length);
        // console.log("New Total Rate: ", newTotalRate);

        await Photo.updateOne(
            { _id: id, 'reviews.user': req.userId },
            {
                $set: {
                    'reviews.$.rate': rate,
                    totalRate: newTotalRate,
                    LoggedUser: req.userId
                }
            }
        );
    } else {
        const totalRate = photo.reviews.reduce((sum, review) => sum + review.rate, 0)
        const finalRate = (totalRate + rate) / (photo.reviews.length + 1)

        await Photo.updateOne(
            { _id: id },
            {
                $push: {
                    reviews: {
                        user: req.userId, rate
                    }
                },
                $set: {
                    totalRate: finalRate,
                    LoggedUser: req.userId
                }
            }
        )
    }
    res.status(201).json({
        success: true
    })
}
