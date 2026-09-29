require('dotenv').config();
const express = require('express')
const app = express();
app.use(express.json());
const authRoutes = require('./Routes/authenticationRoutes');
const eventRouter = require('./Routes/eventParticipantRoutes');



app.use('/api/v1/authentication/user/',authRoutes);
app.use('/api/v1/',eventRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log( `Server is running on Server ${PORT}`);
})