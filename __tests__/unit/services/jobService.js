require('dotenv').config();

const ApiError = require('../../../src/utils/ApiError');
const { connectForTest, disconnectForTest } = require('../../../src/config/database');
const jobService = require('../../../src/services/jobService');
const Job = require('../../../src/models/job');

beforeAll(() => {
    connectForTest();
});

afterAll((done) => {
    disconnectForTest(done);
});

describe('jobService', () => {
    const jobData = {
        name: 'Test Min Price and Max Pirce',
        description: 'Min Price lagger than Max Price',
        startDate: '12-01-2022',
        endDate: '12-30-2022',
        minPrice: 500,
        maxPrice: 200,
        category: '63672b0bce134b106a91479f',
        owner: '63672b0cce134b106a9147b1'
    };

    describe('createJob', () => {
        test('it should throw an error \'MaxPrice must be lagger than MinPrice\'', async () => {
            const error = async () => await jobService.createJob(jobData);

            await expect(error).rejects.toThrow(ApiError);
            await expect(error).rejects.toThrow('MaxPrice must be lagger than MinPrice');
        });

        test('it should return a job', async () => {
            jobData.name = 'New job';
            jobData.description = 'Test create new job';
            jobData.minPrice = 100;
            jobData.maxPrice = 200;

            const res = await jobService.createJob(jobData);

            expect(res).toBeInstanceOf(Job);
            expect(res.name).toBe(jobData.name);
            expect(res.description).toBe(jobData.description);
            expect(res.minPrice).toBe(jobData.minPrice);
            expect(res.maxPrice).toBe(jobData.maxPrice);
        });
    })
})
