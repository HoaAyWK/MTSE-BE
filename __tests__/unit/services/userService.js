require('dotenv').config();

const ApiError = require('../../../src/utils/ApiError');
const { connectForTest, disconnectForTest } = require('../../../src/config/database');
const userService = require('../../../src/services/userService');
const User = require('../../../src/models/User');

beforeAll(() => {
    connectForTest();
});

afterAll((done) => {
    disconnectForTest(done);
});

describe('userService', () => {
    const userBody = {
        name: 'Super employer',
        address: 'Thu Duc',
        city: 'Ho Chi Minh',
        country: 'Viet Nam'
    };

    describe('updateUser', () => {
        test('it should throw an error \'User not found\'', async () => {
            const id = '63672b0cce134b106a9147b9';
            const error = async () => {
                await userService.updateUser(id, userBody);
            };

            await expect(error).rejects.toThrow(ApiError);
            await expect(error).rejects.toThrow('User not found');
        });

        test('it should return an updated user', async () => {
            const id = '63672b0cce134b106a9147b1';
            const res = await userService.updateUser(id, userBody);

            expect(res).toBeInstanceOf(User);
            expect(res.name).toBe(userBody.name);
            expect(res.address).toBe(userBody.address);
            expect(res.city).toBe(userBody.city);
            expect(res.country).toBe(userBody.country);
        });
    })
})
