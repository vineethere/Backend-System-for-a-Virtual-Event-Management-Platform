const express = require('express');
const router = express.Router();
router.use(express.json());
const { getAllEvents } = require('../Controller/eventsController');
const isAuthorized = require('../Middleware/auth');
router.use(isAuthorized);


router.get('/events',(req,res)=>{
   try{
      const data = getAllEvents();
   res.status(200).json({"values":data});
   }
   catch(error){
    res.status(400).json({errorMessage: error.message});
   }
})


module.exports = router;