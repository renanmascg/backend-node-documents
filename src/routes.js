const express = require('express');

// Controllers
const SessionController = require('./controllers/SessionController');
const DocumentController = require('./controllers/DocumentController');
const DocumentUploadController = require('./controllers/DocumentUploadController');

// Middlewares
const UserVerifyMiddleware = require('./middlewares/UserVerifyMiddleware');
const MultiFormMiddleware = require('./middlewares/MultiFormMiddleware');

const routes = express.Router();

routes.post('/sessions/signup', SessionController.store);
routes.post('/sessions/login', SessionController.show);
routes.post('/sessions/signin', SessionController.show);

routes.use(UserVerifyMiddleware.userIdVerify);
//routes.use(UserVerifyMiddleware.isProtected);

routes.post('/documents', DocumentController.store);
routes.get('/documents', DocumentController.show);

routes.post('/docUpload',MultiFormMiddleware.upload.single('docFile'), DocumentUploadController.store);

module.exports = routes;
