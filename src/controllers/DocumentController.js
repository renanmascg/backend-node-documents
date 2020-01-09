const Document = require('../models/Document');

const store = async (req,res) => {
  const { user } = req;

  try {

    let documents = await Document.findOne({ user: user._id});

    if (!documents) {
      documents = await Document.create({
        user: userId,
      });
    }

    return res.status(200).json({ 
      documents
    });

  } catch(err) {
    return res.boom.badRequest('Documents of this user not found');
  }
}

const show = async (req,res) => {
  const { userid: userId } = req.headers;

  try {
    const documents = await Document.findOne({ user: userId});

    return res.status(200).json({ 
      documents
    });
  } catch(err) {
    return res.boom.badRequest('Documents of this user not found2');
  }
}

module.exports = {
  store,
  show
}