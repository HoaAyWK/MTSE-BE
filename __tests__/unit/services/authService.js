require("dotenv").config();

const ApiError = require('../../../src/utils/ApiError');
const authService = require('../../../src/services/authService');
const { connectForTest, disconnectForTest } = require('../../../src/config/database');
const User = require('../../../src/models/User');


beforeAll(() => {
    connectForTest();
});

afterAll((done) => {
    disconnectForTest(done);
});

describe('authService', () => {
    describe('login', () => {
        test('it should throw an error \'Incorrect Email or Password\' when no user with the email provided exists', async () => {
            const email = 'myemail@gmail.com';
            const password = '123456';

            const error = async () => {
                await authService.login(email, password)
            };

            await expect(error).rejects.toThrow(ApiError);
            await expect(error).rejects.toThrow('Incorrect Email or Password');
        });

        test('it should throw an error \'Incorrect Email or Password\' when the password provided doesn\'t match', async () => {
            const email = 'freelancer@gmail.com';
            const password = '12345a';

            const error = async () => {
                await authService.login(email, password);
            };

            await expect(error).rejects.toThrow(ApiError);
            await expect(error).rejects.toThrow('Incorrect Email or Password');
        });

        test('it should throw an error \'Your email is not verified. Please, verify your email!\'', async () => {
            const email = 'freelancer4@gmail.com';
            const password = '123456';

            const error = async () => {
                await authService.login(email, password);
            };

            await expect(error).rejects.toThrow(ApiError);
            await expect(error).rejects.toThrow('Your email is not verified. Please, verify your email!');
        });

        test('it should throw an error \'Your account is banned\'', async () => {
            const email = 'freelancer5@gmail.com';
            const password = '123456';

            const error = async () => {
                await authService.login(email, password);
            };

            await expect(error).rejects.toThrow(ApiError);
            await expect(error).rejects.toThrow('Your account is banned');
        });

        test('it should throw an error \'Your account no longer exists\'', async () => {
            const email = 'freelancer3@gmail.com';
            const password = '123456';

            const error = async () => {
                await authService.login(email, password);
            };

            await expect(error).rejects.toThrow(ApiError);
            await expect(error).rejects.toThrow('Your account no longer exists');
        });

        test('it should return an user', async () => {
            const email = 'freelancer@gmail.com';
            const password = '123456';
            const user = await authService.login(email, password);

            expect(user).toBeInstanceOf(User);
            expect(user.email).toBe(email);
        })
    });

    describe('register', () => {
        test('it should throw an error \'Email already in use\'', async () => {
            const email = 'freelancer@gmail.com';
            const name = 'Leo';
            const phone = '03921939876';
            const password = '1234567';

            const error = async () => {
                await authService.register(email, name, phone, password);
            };

            await expect(error).rejects.toThrow(ApiError);
            await expect(error).rejects.toThrow('Email already in use');
        });

        test('it should return a token for the user have not verified the email yet', async () => {
            const email = 'freelancer6@gmail.com';
            const name = 'Test register not verified email';
            const phone = '03921939876';
            const password = '1234567';

            const res = await authService.register(email, name, phone, password);
            
            expect(typeof res).toBe('string');
        });

        test('it should return a token for a new register', async () => {
            const email = 'employer02@gmail.com';
            const name = 'Test new register';
            const phone = '03921939876';
            const password = '123456';

            const res = await authService.register(email, name, phone, password);
            
            expect(typeof res).toBe('string');
        });
    });
});
