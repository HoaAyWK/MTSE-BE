const Wallet = require('../models/wallet')
const pointHistoryService = require('./pointHistoryService')

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
        const wallet = await Wallet.findOne({userId})

        return wallet
    }

    async addPoint(walletId, points){
        const wallet = await Wallet.findById(walletId)

        if (!wallet){
            return null
        }

        const newPoint = wallet.points + points

        await Wallet.findByIdAndUpdate(wallet._id, { $set: { points: newPoint }})

        const newInfoWallet = await Wallet.findById(walletId)

        return newInfoWallet
    }
}

module.exports = new WalletService