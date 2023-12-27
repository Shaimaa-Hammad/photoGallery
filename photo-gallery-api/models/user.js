/**
 * Module dependencies.
 */
const mongoose = require('mongoose')

/**
 * Schema definition 
 */
const ModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    ownPhotos: {
        type: [
            {
                id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Photo',
            },
            title: String,
            _id: false
        }
        ],
    },
    profilePicture: {
        type: String, // Assuming you store the file path or URL as a string
    },
}, {
    timestamps: true
})

ModelSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {  
        delete ret._id
    }
});

const Model = mongoose.model('User', ModelSchema)

module.exports = Model