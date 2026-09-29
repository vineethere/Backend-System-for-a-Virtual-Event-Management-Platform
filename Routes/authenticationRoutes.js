const express = require('express');
const router = express.Router();
router.use(express.json());
const { checkLoginCredentials, isSuccessfullyRegistered } = require('../Controller/authenticationController');

router.post('/login', (req, res) => {
    const { userName, password } = req.body;
    if (checkLoginCredentials(userName, password)) {
        res.status(200).send(`Successfully logged in`);
    }
    else {
        res.status(400).send('Incorrect Password');
    }
})

router.post('/register', async (req, res) => {
    try {
        let error = await isSuccessfullyRegistered(req.body);
        if (error.length > 0) {
            res.status(400).json({"erorrMessage":error});
        }
        else {
            res.status(200).json({"registeredTxt":`Successfully Registered`});
        }
    }
    catch (e) {
        res.status(400).json({"erorrMessage":e});
    }

})

module.exports = router;