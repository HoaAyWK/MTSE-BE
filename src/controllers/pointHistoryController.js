const pointHistoryService = require('../services/pointHistoryService')
const { systemAdminId } = require('../config/constants');
const seventDays = require('../utils/getDate');
const userService = require('../services/userService');

class PointHistoryController{
    async createPointHistory(req, res, next) {
        try {
            const pointHistory = await pointHistoryService
                .createPointHistory(systemAdminId, req.user.id, req.body.point );

            res.status(200).json({
                success: true,
                pointHistory
            })
        } catch (error) {
            next(error);   
        }
    }

    async getComission(req, res, next) {
        try {
            const comission = await pointHistoryService.getComission(req.body.start, req.body.end);

            res.status(200).json({
                success: true,
                comission
            });
        } catch (error) {
            next(error);
        }
    }

    async getSystemAdminSevenDayHistory(req, res, next) {
        try {
            const pointHistoryGroupByDate = await pointHistoryService.getSystemAdminSevenDayHistory();

            res.status(200).json({
                success: true,
                pointHistories: pointHistoryGroupByDate
            });
        } catch (error) {
            next(error);
        }
    }

    async getSystemAdminOneYearHistory(req, res, next) {
        try {
            const pointHistories = await pointHistoryService.getSystemAdminOneYearAgo();

            res.status(200).json({
                success: true,
                pointHistories
            });
        } catch (error) {
            next(error);
        }
    }

    async getStatistic(req, res, next) {
        try {
            const days = await pointHistoryService.getSystemAdminSevenDayHistory();
            const year = await pointHistoryService.getSystemAdminOneYearAgo();
            const total = await pointHistoryService.getTotalEarning();
            const totalUsers = await userService.getTotalUsers();

            res.status(200).json({
                success: true,
                data: [days, year, total, totalUsers - 2]
            })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PointHistoryController;