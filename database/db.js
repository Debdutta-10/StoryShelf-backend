const mongoose = require("mongoose");

require("dotenv").config();

const dbConnect = () => {
    mongoose.connect(process.env.MONGO_URL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    })
    .then(() => console.log("Database connected successfully !!"))
    .catch((err) => console.log(err));
}

module.exports = dbConnect;
