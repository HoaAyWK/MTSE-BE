const { ResponseCreateWallet, ResponseGetWalletByUser } = require("../DTOs/walletDTO")
const walletService = require("../services/walletService")


class WalletController{
    async createWallet(req, res){
        const response = new ResponseCreateWallet()
        try{
            const wallet = req.body
            const addedWallet = await walletService.createWallet(wallet)

            if(addedWallet){
                response.message = "Error Add Wallet"
                return res.status(400).json(response)
            }

            response.message = "Create Wallet Successfully"
            response.success = true
            response.wallet = addedWallet

            return res.status(200).json(response)
        }
        catch(error){
            response.message = error
            return res.status(500).json(response)
        }
    }

    async getWalletById(req, res){
        var response = new ResponseGetWallet()
        try{
            const id = req.params.id

            if(!id){
                return res.status(400).json(response)
            }

            const wallet = await walletService.getWalletById(id)
            response.wallet = wallet

            return res.json(200).json(response)
        }   
        catch(error){
            return res.json(500).json(error)
        }
    }
}


module.exports = new WalletController