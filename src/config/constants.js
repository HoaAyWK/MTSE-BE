const mongoose = require('mongoose');


// luu tien bao hiem
const adminId = new mongoose.Types.ObjectId("6353bb23e745a340f2dcb8d1");

// luu tien hoa hong
const systemAdminId = new mongoose.Types.ObjectId("6353bb3476a3d476341f6028");

console.log(systemAdminId);

module.exports = {
    adminId,
    systemAdminId
}