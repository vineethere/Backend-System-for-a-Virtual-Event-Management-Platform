const express = require('express');
const router = express.Router();
router.use(express.json());
const { getAllEvents, modifyEvent, deleteEvent, createEvent, sendEmail } = require('../Controller/eventsController');
const isAuthorized = require('../Middleware/auth');
router.use(isAuthorized);



router.get('/events', (req, res) => {
   try {
      const data = getAllEvents();
      res.status(200).json({ "values": data });
   }
   catch (error) {
      res.status(400).json({ errorMessage: error.message });
   }
})


router.put('/updateEvent', (req, res) => {
   try {
      const { eventId, emailId, updateDescription } = req.body;
      const data = modifyEvent(eventId, emailId, updateDescription);
      res.status(200).json({ "updatedData": data });
   }
   catch (error) {
      res.status(400).json({ errorMessage: error.message });
   }
})

router.delete('/deleteEvent', (req, res) => {
   try {
      const { eventId, emailId } = req.body;
      const data = deleteEvent(eventId, emailId);
      res.status(200).json({ "updatedData": data });
   }
   catch (error) {
      res.status(400).json({ errorMessage: error.message });
   }
})


router.post('/events', (req, res) => {
   try {
      const data = createEvent(req.body);
      res.status(201).json({ createdEvent: data });
   }
   catch (error) {
      res.status(400).json({ errorMessage: error.message });
   }
})

router.post('/sendEmail', async (req, res) => {
   try {
      const result = await sendEmail(req.body);
      res.status(200).json({ message: 'Email sent successfully', info: result });
   }
   catch (e) {
      res.status(400).json({ errorMessage: e.message });
   }
})

module.exports = router;