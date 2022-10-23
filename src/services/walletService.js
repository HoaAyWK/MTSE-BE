const Wallet = require('../models/wallet');
const { adminId, systemAdminId } = require('../config/constants');
const ApiError = require('../utils/ApiError');
const userService = require('./userService');
class WalletService{
    async createWallet(wallet){
        const existedWallet = await this.getWalletByUser(wallet.userId)

        if(existedWallet){
            return null
        }

        const newWallet = new Wallet(wallet)

        await newWallet.save()

        return newWallet
    }

    async getWalletById(walletId){
        const wallet = await Wallet.findById(walletId)

        return wallet
    }

    async getWalletByUser(userId){
        const wallet = await Wallet.findOne({ user: userId })

        return wallet
    }

    async getAdminWallet() {
        const admin = await userService.getAdmin();

        if (!admin) {
            throw new ApiError(500, 'Admin not found');
        }

        return Wallet.findOne({ user: admin._id });
    }

    async getSystemAdminWalllet() {
        const systemAdmin = await userService.getSystemAdmin();

        if (!systemAdmin) {
            throw new ApiError(500, 'System Admin not found');
        }

        return Wallet.findOne({ user: systemAdmin._id });
    }

    async addPoint(walletId, points){
        const wallet = await Wallet.findById(walletId)

        if (!wallet){
            throw new ApiError(404, 'Wallet not found');
        }

        const newPoint = wallet.points + points

        await Wallet.findByIdAndUpdate(wallet._id, { $set: { points: newPoint }})

        const newInfoWallet = await Wallet.findById(walletId)

        return newInfoWallet
    }

    async handlePoint(walletId, money, handle){
        const wallet = await Wallet.findById(walletId);
        if (handle === true) {
            wallet.points = wallet.points + money
        }
        else {
            wallet.points = wallet.points - money
        }
        await wallet.save();
    }
}

module.exports = new WalletService