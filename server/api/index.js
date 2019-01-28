const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'user'
});

const ctrlAuthentication  = require('./controllers/authentication')
const ctrlProfile         = require('./controllers/profile')
const ctrlUsers           = require('./controllers/users')
const ctrlEma             = require('./controllers/ema')
const ctrlStations        = require('./controllers/stations')
const ctrlSystem          = require('./controllers/system')
const ctrlSubscriptions   = require('./controllers/subscriptions')
const ctrlAgromet         = require('./controllers/agromet')
const ctrlHoboStations    = require('./controllers/hobostations')
const ctrlMiniStations    = require('./controllers/mini-stations')
const ctrlAgrometModels   = require('./controllers/agromet-models')
const ctrlAgrometPredictions = require('./controllers/agromet-predictions')

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

// ========== HoboStations Endpoints ===============
router.post('/hoboupload', ctrlHoboStations.uploadFile);
router.get(
  '/hobostations',
  ctrlHoboStations.readStationList
)
router.post(
  '/hobostations',
  auth,
  roleAuth(['administrator']),
  ctrlHoboStations.createStation
);
router.delete(
  '/hobostations/:id',
  auth,
  roleAuth(['administrator']),
  ctrlHoboStations.deleteStation
);
router.get(
  '/hobostations/:id',
  ctrlHoboStations.readStation
);
router.patch(
  '/hobostations/:id',
  auth,
  roleAuth(['administrator']),
  ctrlHoboStations.updateStation
)
router.get(
  '/hobodata/:station',
  ctrlHoboStations.getSensorDataByDate
)

// ================ Ema Endpoints ==================
// Queries data from legacy API at:
// http://srvbioinf1.utalca.cl/heladas/monitor/index.php
router.get('/ema', ctrlEma.readEmaList);
router.get('/prediction/:id', ctrlEma.readEmaPrediction);
router.get('/agromet/history/:emaId', ctrlAgromet.getEmaHistory);
router.get('/agromet/variables', ctrlAgromet.getVariables);
router.get('/agromet/regions', ctrlAgromet.getRegions);
router.get('/agromet/cities', ctrlAgromet.getCities);
router.get('/agromet/emas', ctrlAgromet.getFilteredEMAs);

// ============ Agromet Backup System ==============
router.post(
  '/agrometstations',
  auth,
  roleAuth(['administrator']),
  ctrlAgromet.createAgrometStation
)
router.get(
  '/agrometstations',
  auth,
  roleAuth(['administrator']),
  ctrlAgromet.listAgrometStations
)
router.get(
  '/agrometpublicstations',
  ctrlAgromet.listAgrometPublicStations
)
router.patch(
  '/agrometstations/:id',
  auth,
  roleAuth(['administrator']),
  ctrlAgromet.editAgrometStation
)
router.get(
  '/agrometstations/:id',
  // auth,
  // roleAuth(['administrator']),
  ctrlAgromet.getAgrometStation
)
router.delete(
  '/agrometstations/:id',
  auth,
  roleAuth(['administrator']),
  ctrlAgromet.removeAgrometStation
)
router.put(
  '/agrometdata/:id',
  auth,
  roleAuth(['administrator']),
  ctrlAgromet.backupAgrometData
)
// Endpoint utilizado para el respaldo automatizado de datos
router.put(
  '/agrometdata/auto/:id',
  ctrlAgromet.backupAgrometData
)
router.get(
  '/agrometdata/count/:id',
  auth,
  roleAuth(['administrator']),
  ctrlAgromet.getAgrometDataCount
)
router.delete(
  '/agrometdata/:id',
  auth,
  roleAuth(['administrator']),
  ctrlAgromet.removeAgrometData
)

// ================ Mini Stations ==================
router.get(
  '/controller-nodes',
  auth,
  roleAuth(['administrator']),
  ctrlMiniStations.getControllerNodes
)
router.get(
  '/controller-nodes/:id',
  auth,
  roleAuth(['administrator']),
  ctrlMiniStations.readControllerNode
)
router.post(
  '/controller-nodes',
  auth,
  roleAuth(['administrator']),
  ctrlMiniStations.createControllerNode
)
router.patch(
  '/controller-nodes/:id',
  auth,
  roleAuth(['administrator']),
  ctrlMiniStations.updateControllerNode
)
router.post(
  '/ministationupload',
  ctrlMiniStations.uploadFile
)
router.get(
  '/ministationdata/:node/:station',
  ctrlMiniStations.getSensorDataByDate
)
router.delete(
  '/ministationdata/:node/:station',
  ctrlMiniStations.deleteSensorDataByDate
)

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
router.get(
  '/stats',
  auth,
  roleAuth(['administrator']),
  ctrlSystem.getStatistics
);

// ============ Subscription Endpoints =============
router.get('/subscriptions', auth, ctrlSubscriptions.readUserSubscriptions);
router.post('/subscriptions/:stationId', auth, ctrlSubscriptions.subscribeToStation);
router.delete('/subscriptions/:stationId', auth, ctrlSubscriptions.unsubscribeToStation);

// ================ Agromet Models =================
router.get(
  '/agrometmodels',
  auth,
  ctrlAgrometModels.getAll
)

router.delete(
  '/agrometmodels/:filename',
  auth,
  ctrlAgrometModels.delete
)

router.post(
  '/agrometmodels',
  //auth,
  ctrlAgrometModels.uploadFiles
)

// ============== Agromet Predictions ==============
router.get(
  '/last-station-prediction/:id',
  // auth,
  ctrlAgrometPredictions.getLastStationPrediction
)

router.get(
  '/agromet-prediction-history/:id',
  // auth,
  ctrlAgrometPredictions.getPredictionHistory
)

router.get(
  '/agrometmeasurements/:id',
  auth,
  roleAuth(['administrator']),
  ctrlAgromet.getSensorDataByDate
)

router.delete(
  '/agrometmeasurements/:id',
  auth,
  roleAuth(['administrator']),
  ctrlAgromet.deleteSensorDataByDate
)

module.exports = router;
