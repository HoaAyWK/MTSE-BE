const walletSchema = require('../models/wallet')


class WalletService{
    async createWallet(wallet){
        const existedWallet = await this.getWalletByUser(wallet.userId)

        if(existedWallet){
            return null
        }

        const newWallet = new walletSchema(wallet)

        await newWallet.save()

        return newWallet
    }

    async getWalletById(walletId){
        const wallet = await walletSchema.findById(walletId)

        return wallet
    }

    async getWalletByUser(userId){
        const wallet = await walletSchema.findOne({userId})

        return wallet
    }

    async addPoint(walletId, points){
        const wallet = await walletSchema.findById(walletId)

        if (!wallet){
            return null
        }

        const newPoint = wallet.points + points

        await walletSchema.findByIdAndUpdate(wallet._id, { $set: { points: newPoint }})

        const newInfoWallet = await walletSchema.findById(walletId)

        return newInfoWallet
    }

}

module.exports = new WalletService