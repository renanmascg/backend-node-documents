const User = require('../models/User');

const userIdVerify = async (req,res,next) => {

  const { userid: userId } = req.headers;

  try {
    const user = await User.findById(userId);

    req.user = user;

    next();

  } catch (err) {

    return res.boom.unauthorized('User not Allowed');
  }

}

module.exports = {
  userIdVerify
}