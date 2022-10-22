const PointHistory = require("../models/pointHistory");
const ApiError = require("../utils/ApiError");
const walletService = require("./walletService");
const Wallet = require('../models/wallet');
const { systemAdminId } = require('../config/constants');


class PointHistoryService{
    async saveRecord(pointHistoryRecord){
        const newRecord = new PointHistory(pointHistoryRecord)

        await newRecord.save()

        return newRecord
    }

    async getPointHistoriesByUserFromDateToDate(userId, startDate, endDate) {
        const wallet = await Wallet.findOne({ user: userId });
        return PointHistory.find({ wallet: wallet.id, createdAt: { $gte: startDate } });
    }

    async getComission(startDate, endDate)
    {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start < end) {
            throw new ApiError(400, 'Start date must be lagger or equal end date');
        }

        if (end > Date.now()) {
            throw new ApiError(400, 'End date must be less than or equal now');
        }

        const wallet = await walletService.getWalletByUser(systemAdminId);
        const pointHisories = await PointHistory.find({ wallet: wallet.id, createdAt: { $gte: start, $lte: end }});

        let comission = 0.0;
        pointHisories.forEach(ph => comission = comission + ph.point);

        return comission;
    }
}

module.exports = new PointHistoryService