const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: { 
      type: String, 
      required: true 
    },
    director: { 
      type: String, 
      required: true }
      ,
    genre: { 
      type: String, 
      required: true 
    },
    releaseDate: { 
      type: Date 
    },
    status: { 
      type: String, enum: ['planning', 'completed'], 
      default: 'planning' 
    },
    rating: { 
      type: Number, min: 0, max: 5 
    },
    review: { 
      type: String 
    },
    user: { 
      type: Schema.Types.ObjectId, ref: 'User' 
    }
  });
  
  module.exports = mongoose.model('Movie', movieSchema);
  