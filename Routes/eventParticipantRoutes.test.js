const express = require('express');
const request = require('supertest');
const eventRouter = require('../Routes/eventParticipantRoutes'); // Adjust path to your router file
const { 
    getAllEvents, 
    modifyEvent, 
    deleteEvent, 
    createEvent, 
    sendEmail 
} = require('../Controller/eventsController');

// 1. Mock the controllers
jest.mock('../Controller/eventsController');

// 2. Mock the auth middleware globally for this file so requests bypass security checks
jest.mock('../Middleware/auth', () => (req, res, next) => {
    next(); 
});

// 3. Set up the virtual Express app
const app = express();
app.use(express.json());
app.use('/', eventRouter);

describe('Events Router API Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // 1. GET /events
    describe('GET /events', () => {
        it('should return 200 and the list of events', async () => {
            const fakeEvents = [{ eventId: '1', title: 'Tech Talk' }];
            getAllEvents.mockReturnValue(fakeEvents);

            const response = await request(app).get('/events');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ values: fakeEvents });
            expect(getAllEvents).toHaveBeenCalled();
        });

        it('should return 400 if fetching events fails', async () => {
            getAllEvents.mockImplementation(() => { throw new Error("Database error"); });

            const response = await request(app).get('/events');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ errorMessage: "Database error" });
        });
    });

    // 2. PUT /updateEvent
    describe('PUT /updateEvent', () => {
        it('should return 200 and updated data when event is modified', async () => {
            const updatedResult = { eventId: '1', updateDescription: 'Updated hall' };
            modifyEvent.mockReturnValue(updatedResult);

            const response = await request(app)
                .put('/updateEvent')
                .send({ eventId: '1', emailId: 'vineet@gmail.com', updateDescription: 'Updated hall' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ updatedData: updatedResult });
            expect(modifyEvent).toHaveBeenCalledWith('1', 'vineet@gmail.com', 'Updated hall');
        });
    });

    // 3. DELETE /deleteEvent
    describe('DELETE /deleteEvent', () => {
        it('should return 200 when an event is deleted', async () => {
            const deleteResult = { eventId: '1', status: 'deleted' };
            deleteEvent.mockReturnValue(deleteResult);

            const response = await request(app)
                .delete('/deleteEvent')
                .send({ eventId: '1', emailId: 'vineet@gmail.com' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ updatedData: deleteResult });
            expect(deleteEvent).toHaveBeenCalledWith('1', 'vineet@gmail.com');
        });
    });

    // 4. POST /events (Create Event)
    describe('POST /events', () => {
        it('should return 201 and the created event', async () => {
            const newEventData = { title: 'Node.js Workshop', date: '2026-10-20' };
            createEvent.mockReturnValue(newEventData);

            const response = await request(app)
                .post('/events')
                .send(newEventData);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ createdEvent: newEventData });
            expect(createEvent).toHaveBeenCalledWith(newEventData);
        });
    });

    // 5. POST /sendEmail (Async Controller)
    describe('POST /sendEmail', () => {
        it('should return 200 when email is sent successfully', async () => {
            const emailInfo = { messageId: 'abc-123' };
            sendEmail.mockResolvedValue(emailInfo); // Since sendEmail is async / returns a promise

            const response = await request(app)
                .post('/sendEmail')
                .send({ emailId: 'vineet@gmail.com', subject: 'Event Invite' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ 
                message: 'Email sent successfully', 
                info: emailInfo 
            });
            expect(sendEmail).toHaveBeenCalled();
        });
    });

});