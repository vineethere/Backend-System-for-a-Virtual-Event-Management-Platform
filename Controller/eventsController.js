
const { EventsData } = require('../Modal/EventsModal');
const nodemailer = require('nodemailer');

const getAllEvents = () => {
    if (EventsData.length === 0) {
        throw new Error('There is some Issue , try after Sometime');
    }
    return EventsData;
}

const modifyEvent = (eventId, emailId, updateDescription) => {
    let item = EventsData.find(item => item.id === eventId);
    if (!item) {
        throw new Error('Could Not find the desired event with corresponding ID provided');
    }
    try {
        if (item.organizer === emailId) {
            // User can only edit / update the Description for this item
            let tempItem;

            tempItem = {
                id: item.id,
                date: item.date,
                time: item.time,
                description: updateDescription,
                participants: ["user3@example.com", "user2@example.com"],
                organizer: item.organizer
            }

            const index = EventsData.findIndex(item => item.id === eventId);
            EventsData[index] = tempItem;
            return tempItem;
        }
        else {
            throw new Error('You cannot change / modify this Request as you are not the organizer');
        }
    }

    catch (error) {
        throw error;
    }

}

const deleteEvent = (eventId, emailId) => {
    let item = EventsData.find(item => item.id === eventId);
    if (!item) {
        throw new Error('Could Not find the desired event with corresponding ID provided');
    }
    try {
        if (item.organizer === emailId) {
            const index = EventsData.findIndex(item => item.id === eventId);
            const entry = EventsData[index].eventId;
            EventsData.splice(index, 1);
            return `Successfully Deleted ${entry}`;
        }
        else {
            throw new Error('You cannot delete this Request as you are not the organizer');
        }
    }

    catch (error) {
        throw error;
    }

}


const getEvent = (eventId, emailId, updateDescription) => {
    let item = EventsData.find(item => item.id === eventId);
    if (!item) {
        throw new Error('Could Not find the desired event with corresponding ID provided');
    }
    try {
        if (item.organizer === emailId) {
            // User can only edit / update the Description for this item
            let tempItem;

            tempItem = {
                id: item.id,
                date: item.date,
                time: item.time,
                description: updateDescription,
                participants: ["user3@example.com", "user2@example.com"],
                organizer: item.organizer
            }

            const index = EventsData.findIndex(item => item.id === eventId);
            EventsData[index] = tempItem;
            return tempItem;
        }
        else {
            throw new Error('You cannot change / modify this Request as you are not the organizer');
        }
    }

    catch (error) {
        throw error;
    }

}
const createEvent = (eventData) => {
    const { id, date, time, description, organizer } = eventData;
    if (!id) throw new Error('id is required');
    if (!date) throw new Error('date is required');
    if (!time) throw new Error('time is required');
    if (!description) throw new Error('description is required');
    if (!organizer) throw new Error('organizer is required');

    const exists = EventsData.find(item => item.id === id);
    if (exists) throw new Error('Event with this id already exists');

    const newEvent = { id, date, time, description, participants: [], organizer };
    EventsData.push(newEvent);
    return newEvent;
}



const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function sendNotification(mailOptions) {
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

const sendEmail = async (body) => {
    const { recipientEmail } = body;
    if (!body) throw new Error('Body is needed for this');

    try {

        const mailOptions = {
            from: `"No reply : " <${process.env.SMTP_USER}>`,
            to: recipientEmail,
            subject: 'Notification: Registration Completed for the new Event',
            text: 'Congratulations , You are eligible and is attending the next big event , make sure you are present and receive a early coming welcome gift (only for first 50 coming members)',
            html: '<b>Welcome! This is going to be very much exciting. Hope to meet You soon</b>'
        };

        await sendNotification(mailOptions);
        return "request sent succesfully" ;
    }
    catch(error){
        throw error;
    }
  
};

// Usage:
// sendEmail({ recipientEmail: 'user@example.com' })
//     .then(() => console.log('Done'))
//     .catch(err => console.error(err));   


module.exports = { getAllEvents, modifyEvent, deleteEvent, createEvent, sendEmail }