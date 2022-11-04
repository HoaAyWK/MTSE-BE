const { Router } = require('express');
const authMiddleware = require('../../middlewares/auth');
const pointHistoryController = require('../../controllers/pointHistoryController');

const router = Router();

router.route('/pointhistories/create')
    .post(
        authMiddleware.isAuthenticated,
        pointHistoryController.createPointHistory
    );

router.route('/pointhistories/comission')
    .post(
        authMiddleware.isAuthenticated,
        pointHistoryController.getComission
    );

router
    .route('/pointhistories/statistic')
    .get(pointHistoryController.getStatistic);

module.exports = router;