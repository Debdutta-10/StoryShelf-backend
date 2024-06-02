const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sharedActivitySchema = new Schema({
    type: { type: String, enum: ['book', 'movie'], required: true }, 
    activityId: { type: Schema.Types.ObjectId, required: true }, 
    userId: { type: Schema.Types.ObjectId, required: true }, 
    timestamp: { type: Date, default: Date.now } 
});

const SharedActivity = mongoose.model('SharedActivity', sharedActivitySchema);

module.exports = SharedActivity;
