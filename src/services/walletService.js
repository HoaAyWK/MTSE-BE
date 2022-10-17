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

    async addPoint(walletId, point){
        const wallet = await walletSchema.findById(walletId)

        if (!wallet){
            return null
        }

        const newPoint = wallet.point + point

        await walletSchema.findByIdAndUpdate(wallet._id, {point: newPoint})

        const newInfoWallet = await walletSchema.findById(walletId)

        return newInfoWallet
    }

}

module.exports = new WalletService