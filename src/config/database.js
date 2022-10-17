const mongoose = require("mongoose");

const connectDatabase = async () => {
    try {
    
        await mongoose.connect(process.env.MONGO_URL)

        console.log("Connected to database")
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = { connectDatabase };