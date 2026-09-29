const express = require('express');
const router = express.Router();
router.use(express.json());
const { checkLoginCredentials, isSuccessfullyRegistered } = require('../Controller/authenticationController');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await checkLoginCredentials(username, password);
        res.status(200).json({ message: 'Successfully logged in', token: result.token });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.post('/register', async (req, res) => {
    try {
        let error = await isSuccessfullyRegistered(req.body);
        if (error.length > 0) {
            res.status(400).json({ "erorrMessage": error });
        }
        else {
            res.status(200).json({ "registeredTxt": `Successfully Registered` });
        }
    }
    catch (e) {
        res.status(400).json({ "erorrMessage": e });
    }
})

module.exports = router;