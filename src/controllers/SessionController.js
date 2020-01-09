const jwt = require('jsonwebtoken');

const configKeys = require('../../config_keys');

// index, show, store, update, destroy
const User = require('../models/User');

const store = async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password) {
      return res.boom.badRequest('Missing parameters');
    }

    let user = await User.findOne({ email });

    if(user) {
      return res.boom.badRequest('User already created');
    }

    user = await User.create({
      email, 
      password
    });

    return res.status(201).json({
      id: user._id,
      email: user.email
    });
  } catch(e) {
    return res.boom.badImplementation(e);
  }
}

const show = async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.boom.badRequest('Missing parameters');
  }

  let user = await User.findOne({ email });

  if(!user) {
    return res.unauthorized("User no found");
  }

  user.comparePassword(password, (err, isMatch) => {
    if(isMatch) {
      const exp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
      const token = jwt.sign({ id: user._id, exp }, configKeys.tokenKey)
      return res.json({
        id: user.id,
        email,
        token
      })
    }
    return res.boom.unauthorized();
  })

}

module.exports = {
  store,
  show
}; 