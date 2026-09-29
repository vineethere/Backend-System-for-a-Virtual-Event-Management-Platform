require('dotenv').config();
const express = require('express')
const app = express();
app.use(express.json());
const authRoutes = require('./Routes/authenticationRoutes');


app.use(express.json())


app.use('/v1/authentication/user/',authRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log( `Server is running on Server ${PORT}`);
})

