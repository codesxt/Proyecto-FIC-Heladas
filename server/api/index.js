const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'user'
});

const ctrlAuthentication  = require('./controllers/authentication');
const ctrlProfile         = require('./controllers/profile');
const ctrlUsers           = require('./controllers/users');
const ctrlEma             = require('./controllers/ema');
const ctrlStations        = require('./controllers/stations');
const ctrlSystem          = require('./controllers/system');
const ctrlSubscriptions   = require('./controllers/subscriptions');
//const ctrlDocuments       = require('./controllers/documents');

const roleAuth            = ctrlAuthentication.roleAuthorization;

// ========== Authentication Endpoints =============

router.post('/register', ctrlAuthentication.register);
router.post('/login', ctrlAuthentication.login);
// router.post('/request-password-reset', ctrlAuth.requestPasswordReset);
// router.post('/reset-password', ctrlAuth.resetPassword);


// ============== Profile Endpoints ================
router.get('/profile', auth, ctrlProfile.getProfile);
router.patch('/profile', auth, ctrlProfile.updateProfile);
// GET      /profile        Gets user data
// PATCH    /profile        Updates user data
// DELETE   /profile        Deletes user account
router.get('/settings', auth, ctrlProfile.getSettings);
router.patch('/settings', auth, ctrlProfile.updateSettings);

// =============== User Management =================
router.get('/users', auth, roleAuth(['administrator']), ctrlUsers.readUserList);
router.get('/users/:userId', auth, roleAuth(['administrator']), ctrlUsers.readUser);
router.patch('/users/:userId', auth, roleAuth(['administrator']), ctrlUsers.updateUser);
/*
// ============= Document Endpoints ================
router.get('/documents/:id', auth, ctrlDocuments.readDocument);
router.patch('/documents/:id', auth, ctrlDocuments.updateDocument);
router.delete('/documents/:id', auth, ctrlDocuments.deleteDocument);
router.post('/documents', auth, ctrlDocuments.createDocument);
router.get('/user-documents', auth, ctrlDocuments.readUserDocumentList);
*/

// ================ Ema Endpoints ==================
// Queries data from legacy API at:
// http://srvbioinf1.utalca.cl/heladas/monitor/index.php
router.get('/ema', ctrlEma.readEmaList);
router.get('/prediction/:id', ctrlEma.readEmaPrediction);

// ===============Station Endpoints ================
router.get('/stations', auth, ctrlStations.readStationList);
router.get('/public-stations', ctrlStations.readStationList);
router.get('/stations/:id', ctrlStations.readStation);
router.post('/stations', auth, roleAuth(['administrator']), ctrlStations.createStation);
router.patch('/stations/:id', auth, roleAuth(['administrator']), ctrlStations.updateStation);
router.delete('/stations/:id', auth, roleAuth(['administrator']), ctrlStations.deleteStation);

router.get('/day-prediction/:id', ctrlStations.readStationDayPrediction);
router.get('/day-before-prediction/:id', ctrlStations.readStationDayBeforePrediction);

router.get('/predictions-history/:id', ctrlStations.getPredictionsHistory);

// =============== System Endpoints ================
router.get('/stats', auth, roleAuth(['administrator']), ctrlSystem.getStatistics);

// ============ Subscription Endpoints =============
router.get('/subscriptions', auth, ctrlSubscriptions.readUserSubscriptions);
router.post('/subscriptions/:stationId', auth, ctrlSubscriptions.subscribeToStation);
router.delete('/subscriptions/:stationId', auth, ctrlSubscriptions.unsubscribeToStation);

module.exports = router;
