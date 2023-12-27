/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

/**
 * Schema definition 
 */
const ModelSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        maxlength: 50,
        required: true
    },
    caption: {
        type: String,
        maxlength: 255
    },
    reviews: {
        type: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                rate: Number
            }
        ],
        default: []
    },
    totalRate: {
        type: Number,
        default: 0
    },
    owner: {
        type: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            name: String
        },
        _id: false, // Set _id to false to prevent automatic creation
        required: true
    },
 }, {
    timestamps: true,
});

ModelSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {  
        delete ret._id
    }
});

const Photo = mongoose.model('Photo', ModelSchema);

module.exports = Photo;
