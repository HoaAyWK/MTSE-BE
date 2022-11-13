const jwt = require('jsonwebtoken');


const verifyToken =  async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token)
        return res.json({success: false, message: 'Invalid token'});
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)

        req.userId = decoded.sub;

        next();
        
    }
    catch(error){
        return res.json({success: false, message: error.message});
    }
}


module.exports = verifyToken;