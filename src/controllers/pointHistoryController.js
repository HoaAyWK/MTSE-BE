const pointHistoryService = require('../services/pointHistoryService')
const { systemAdminId } = require('../config/constants');

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
}

module.exports = new PointHistoryController;