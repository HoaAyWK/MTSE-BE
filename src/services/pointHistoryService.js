const pointHistorySchema = require("../models/pointHistory")


class PointHistoryService{
    async saveRecord(pointHistoryRecord){
        const newRecord = new pointHistorySchema(pointHistoryRecord)

        await newRecord.save()

        return newRecord
    }
}

module.exports = new PointHistoryService