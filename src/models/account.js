const mongoose = require('mongoose');
const { compare, hash } = require('bcryptjs');

const { toJSON } = require('./plugins');

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        required: true,
        defualt: ['freelancer']
    },
    emailConfirmed: {
        type: Boolean,
        required: true,
        default: false
    },
}, { timestamps: true });

accountSchema.plugin(toJSON);

accountSchema.pre('save', async function(next) {
    if (this.password === null || !this.isModified('password')) {
        next();
    }

    this.password = await hash(this.password, 10);
});

accountSchema.methods.isPasswordMatch = async function(password) {
    return compare(password, this.password);
};

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;