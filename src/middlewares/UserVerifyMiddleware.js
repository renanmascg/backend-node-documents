const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isProtected = async (req, res, next) => {

    if(!req.headers['authorization'])
        return next(res.boom.unauthorized('User not signed in'));
    
    const bearer = req.headers['authorization'].split('Bearer ')[1];
    try {
        const decoded = await jwt.verify(bearer, JWTSECRET);
        const user = await User.findOne({ _id: decoded.id }, { password: 0 } );
        if(user)
            req.user = user;
        next()
    } catch(e) {
        next()
    }
}

const userIdVerify = (req,res,next) => {

  const { userid: userId } = req.headers;

  if(!userId) {
    return res.forbidden("User not allowed");
  }

  next();

}

module.exports = {
  userIdVerify,
  isProtected
}