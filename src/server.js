require('dotenv').config();
const cloudinary = require('cloudinary').v2;

const app = require('./app');
const { connectDatabase } = require('./config/database');

const PORT = process.env.PORT || 5000;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

connectDatabase();

app.listen(PORT, () => 
    console.log(`http://localhost:${PORT}`)
);