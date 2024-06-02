const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const dbConnect = require("./database/db.js");

require("dotenv").config();

const PORT = process.env.PORT || 5000;
const userRoutes = require("./routes/authRoutes.js");
const bookRoutes = require("./routes/bookRoutes.js")

app.use(cookieParser());
app.use(express.json());
app.use("/api/v1", userRoutes);
app.use("/api/v1", bookRoutes);

app.listen(PORT, () => {
    console.log(`Connected to PORT ${PORT}`);
});

dbConnect();
