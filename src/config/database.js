const mongoose = require("mongoose");

const connectDatabase = async () => {
    try {
    
        await mongoose.connect(process.env.MONGODB_URL)

        console.log("Connected to database")
    } catch (error) {
        console.log(error.message);
    }
};

const connectForTest = () => {
    mongoose.Promise = Promise;
    mongoose.connect(process.env.MONGODB_URL);
};

const disconnectForTest = (done) => {
    mongoose.disconnect(done);
};

module.exports = { connectDatabase, connectForTest, disconnectForTest };