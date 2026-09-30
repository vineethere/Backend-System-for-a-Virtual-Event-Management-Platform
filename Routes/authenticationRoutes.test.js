const express = require('express');
const request = require('supertest');
const authRouter = require('./authenticationRoutes');
const { checkLoginCredentials, isSuccessfullyRegistered } = require('../Controller/authenticationController')

jest.mock('../Controller/authenticationController');


//we are making a little server to test our application
const app = express();
app.use(express.json());
app.use('/', authRouter);



//describe the test suite for testing 
describe('Authentication Router API tests', () => {

    //before every test case we will clear the mock caching
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /login', () => {

        //happy case for our successful login
        it('should return 200 and  token when login credentials are valid ', async () => {

            // When your Express route calls checkLoginCredentials(...), 
            // normally it would have to talk to a real database, check passwords, and wait for a response.
            checkLoginCredentials.mockResolvedValue({ token: 'fake-jwt-token-123' });


            //USing supertest we are firing the POST request
            const response = await (request(app)).post('/login').send({ username: 'vineet', password: 'password' })


            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: 'Successfully logged in',
                token: 'fake-jwt-token-123'
            });
            // It confirms that checkLoginCredentials was actually called during
            //  the API request (it didn't get skipped).

            // More importantly, it checks the exact inputs passed into it.
            //  It verifies that your route successfully grabbed 'vineet' as the username and 'password' as the password from req.body and
            //  handed them correctly to your controller.
            expect(checkLoginCredentials).toHaveBeenCalledWith('vineet', 'password');

        }),

            it('should return 400 when Incorrect credential are entered', async () => {
                checkLoginCredentials.mockRejectedValue(new Error(" Password is  Wrong pls check"));

                //Using supertest for firing the mock result
                const response = await (request(app)).post('/login').send({ username: "vineet", password: 'wrongpassword' });
                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    error: " Password is  Wrong pls check"
                })
                expect(checkLoginCredentials).toHaveBeenCalledWith('vineet', 'wrongpassword');

            }),

            it('should succesfully register ', async () => {
                isSuccessfullyRegistered.mockResolvedValue({ "registeredTxt": `Successfully Registered` });

                //Using supertest for firing the mock result
                const response = await (request(app)).post('/register').send({ username: "vineet", password: 'password', email: "vineet@gmail.com" });
                expect(response.status).toBe(200);
                expect(response.body).toEqual({ "registeredTxt": `Successfully Registered` })
                expect(isSuccessfullyRegistered).toHaveBeenCalledWith({ username: "vineet", password: 'password', email: "vineet@gmail.com" });

            })

        it('should ask for email if not entered / user forgot to enter', async () => {
            isSuccessfullyRegistered.mockRejectedValue("email is required to register");
            const response = await (request)(app).post('/register').send({ username: "vineet", password: "password" });

            expect(response.body).toEqual({
                erorrMessage: "email is required to register"
            })

            expect(isSuccessfullyRegistered).toHaveBeenCalledWith({
                username: "vineet",
                password: "password"
            })

        }),


            it('should ask for password if not entered / user forgot to enter', async () => {
                isSuccessfullyRegistered.mockRejectedValue("password is required to register");
                const response = await (request)(app).post('/register').send({ username: "vineet", email: "vineet@gmail.com" });

                expect(response.body).toEqual({
                    erorrMessage: "password is required to register"
                })

                expect(isSuccessfullyRegistered).toHaveBeenCalledWith({
                    username: "vineet",
                    email: "vineet@gmail.com"
                })

            })






              it('should ask for username if not entered / user forgot to enter', async () => {
                isSuccessfullyRegistered.mockRejectedValue("UserName is required");
                const response = await (request)(app).post('/register').send({ password: "password", email: "vineet@gmail.com" });

                expect(response.body).toEqual({
                    erorrMessage: "UserName is required"
                })

                expect(isSuccessfullyRegistered).toHaveBeenCalledWith({
                    password: "password",
                    email: "vineet@gmail.com"
                })

            })


    })
})

