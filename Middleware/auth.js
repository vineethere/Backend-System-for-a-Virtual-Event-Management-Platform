const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const isAuthorized = (req, res, next) => {
    const token  = req.headers.authorization;
    // console.log(req.headers,"headerds",req.header);
    if(!token){
        return res.status(400).send({message:`Token is required`});
    }
    let decodedToken ;

    try{
        decodedToken = jwt.verify(token,JWT_SECRET);
    }
    catch(error){
        return res.status(400).send({message: `Invalid Token`});
    }

    req.decodedToken = decodedToken;
    next();
}

module.exports = isAuthorized;