const PointHistory = require("../models/pointHistory");
const ApiError = require("../utils/ApiError");
const walletService = require("./walletService");
const Wallet = require('../models/wallet');
const userService = require("./userService");
const sevenDays = require('../utils/getDate');
const { getPast12Months } = require("../utils/getMonth");

class PointHistoryService{
    async createPointHistory(pointHistoryBody) {
        return PointHistory.create(pointHistoryBody);
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

        
        const wallet = await walletService.getSystemAdminWalllet();

        if (!wallet) {
            throw new ApiError(404, 'System Admin wallet not found');
        }
        const pointHisories = await PointHistory.find({ wallet: wallet.id, createdAt: { $gte: start, $lte: end }});

        let comission = 0.0;
        pointHisories.forEach(ph => comission = comission + ph.point);

        return comission;
    }

    async getTotalUsers() {
        const totalUsers = await userService.getTotalUsers();
    }

    async getTotalEarning() {
        const systemAdminWallet = await walletService.getSystemAdminWalllet();
        const total = await PointHistory.aggregate([
            {
                $match: {
                    wallet: systemAdminWallet._id
                }
            },
            {
                $group: {
                    _id: {
                        wallet: '$wallet'
                    },
                    totalPoints: {
                        $sum: '$point'
                    }
                }
            }
        ]);

        return total[0].totalPoints;
    }

    async getSystemAdminSevenDayHistory() {
        const now = new Date();
        const toDay = now.setHours(0, 0, 0, 0);
        let pastSevenDay = new Date(toDay);
        pastSevenDay.setDate(pastSevenDay.getDate() - 7);
        const systemAdminWallet = await walletService.getSystemAdminWalllet();

        // 'date': { $dateToString: { format: '%Y-%m-%d', date: "$createdAt"}},
        const pointHistories = await PointHistory
            .aggregate([
                {
                    $match: {
                        wallet: systemAdminWallet._id,
                        createdAt: { $gte: pastSevenDay }
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt'}},
                        totalPoints: {
                            $sum: '$point'
                        }
                    },
                },
            ]
        );
        
        const _7Days = sevenDays();
            
        const dayObj = {}
        for (let day in _7Days) {
            dayObj[_7Days[day]] = 0;
        }
        
        for (let item in pointHistories) {
            dayObj[pointHistories[item]._id] = pointHistories[item].totalPoints;
        }

        return dayObj;
    }

    async getSystemAdminOneYearAgo() {
        let thisDayLastYear = new Date();
        thisDayLastYear.setDate(thisDayLastYear.getDate() - 365);

        const systemAdminWallet = await walletService.getSystemAdminWalllet();
        const past12Months = getPast12Months();

        const pointHisories = await PointHistory
            .aggregate([
                {
                    $match: {
                        wallet: systemAdminWallet._id,
                        createdAt: { $gte: thisDayLastYear }
                    },
                },
                {
                    $group: {
                        _id: { month: '$month',
                            wallet: '$wallet'
                        },
                        totalPoints: {
                            $sum: '$point'
                        }
                    },
                },
            ]
        );

        const monthsObj = {};

        for (let month in past12Months) {
            monthsObj[past12Months[month]] = 0;
        }

        for (let item in pointHisories) {
            monthsObj[pointHisories[item]._id.month] = pointHisories[item].totalPoints;
        }

        return monthsObj;
    }
}

module.exports = new PointHistoryService