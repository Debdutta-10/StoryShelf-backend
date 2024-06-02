const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { 
        type: String, 
        unique: true, 
        required: true 
    },
    email: { 
        type: String, 
        unique: true, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    bookList: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
    movieList: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
    genres: {
        type: [String],
    },
    favoriteAuthors: {
        type: [String],
    },
    favoriteDirectors: {
        type: [String],
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('User', userSchema);