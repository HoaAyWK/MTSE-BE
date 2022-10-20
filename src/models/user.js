const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { toJSON, paginate } = require('./plugins');
const { userStatus } = require('../config/userStatus');
const { roles } = require('../config/roles');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: [
            'None',
            'Male',
            'Female'
        ],
        default: 'None'
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    bDate: {
        type: Date
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    stars: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: [
            userStatus.ACTIVE,
            userStatus.BANNED,
            userStatus.DELETED
        ],
        default: userStatus.ACTIVE,
    },
    roles: {
        type: [String],
        required: true,
        default: [roles.FREELANCER]
    },
    company: String,
    companyRole: String,
    introduction: String,
    identityNumber: String,
    experience: String
}, { timestamps: true });

UserSchema.plugin(toJSON);
UserSchema.plugin(paginate);

UserSchema.statics.isEmailTaken = async function(email, excludedUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludedUserId }});
    return !!user;
};

UserSchema.methods.isEnoughInfoToPost = async function() {
    if (!this.company ||
        !this.companyRole ||
        !this.identityNumber ||
        !this.address ||
        !this.city ||
        !this.country) {
        return false;
    }

    return true;
};

UserSchema.methods.isEnoughInfoToOfferJob = async function() {
    if (!this.introduction||
        !this.identityNumber ||
        !this.experients ||
        !this.address ||
        !this.city ||
        !this.country) {
        return false;
    }
    
    return true;
};

module.exports = mongoose.model('User', UserSchema)