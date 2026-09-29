
const { EventsData } = require('../Modal/EventsModal');

const getAllEvents = () => {
    if (EventsData.length === 0) {
        throw new Error('There is some Issue , try after Sometime');
    }
    return EventsData;
}

module.exports = { getAllEvents };