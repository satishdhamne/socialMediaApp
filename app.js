// authentication using the bcryppt
// post creation 
// update profile data
// comment on post
// like
// follow / unfollow


require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose');
const authRoutes = require("./routes/auth");
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const likeRoutes = require("./routes/likeRoutes");

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());

mongoose.connect("mongodb+srv://satishdhamne13012:I6864lO6Q1cSIFMC@cluster0.dkf1i.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if DB connection fails
  });

app.use("/auth", authRoutes);
app.use('/postRoutes', postRoutes);
app.use('/commentRoutes', commentRoutes);
app.use('/userRoutes', userRoutes);
app.use('/likeRoutes', likeRoutes);

app.use('/userRoutes', (req, res, next) => {
    console.log(`Request received at: ${req.path}`);
    next();
});

app.get( "/", (req, res) => {
    res.send( " hello SMA ");
})

app.listen(3000, ()=> {
    console.log("server is runing on the port 3000");
})






