const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnect = require("./database/db.js");

require("dotenv").config();

const PORT = process.env.PORT || 5000;
const userRoutes = require("./routes/authRoutes.js");
const bookRoutes = require("./routes/bookRoutes.js");
const movieRoutes = require("./routes/movieRoute.js");
const activityRoutes = require("./routes/activityRoutes.js");

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/api/v1", userRoutes);
app.use("/api/v1", bookRoutes);
app.use("/api/v1", movieRoutes);
app.use("/api/v1", activityRoutes);

app.listen(PORT, () => {
    console.log(`Connected to PORT ${PORT}`);
});

dbConnect();
