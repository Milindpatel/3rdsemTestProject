const express = require('express');
const router = express.Router();

var ctrlDtc = require('../controllers/dtc.controllers.js');
var ctrlECodes = require('../controllers/engineCodes.controllers.js');
var ctrlFreezeFrame = require('../controllers/freezeFrame.controllers.js');
var ctrlReadiness = require('../controllers/readinessCodes.controllers.js');
var ctrlRpm = require('../controllers/rpm.controllers.js');


//*********For RPM *********/
router
    .route('/rpm')
    .post(ctrlRpm.rpmAddAll)
    .get(ctrlRpm.rpmGetAll)

router
    .route('/rpm/:id')
    .get(ctrlRpm.rpmsGetOne)


//*********For Diagnostic Trouble Codes*********/
router
    .route('/dtcs')
    .post(ctrlDtc.dtcAddAll)
    .get(ctrlDtc.dtcGetAll)
router
    .route('/dtc/:id')
    .get(ctrlDtc.dtcGetOne)


//*********For Readiness Codes*********/
router
    .route('/readiness')
    .post(ctrlReadiness.readinessCodesAddAll)
    .get(ctrlReadiness.readinessCodesGetAll)

router
    .route('/readiness/:id')
    .get(ctrlReadiness.readinessCodesGetOne)


//*********For engine codes*********/
router
    .route('/e_codes')
    .post(ctrlECodes.eCodeAddAll)
    .get(ctrlECodes.eCodeGetAll)

router
    .route('/e_codes/:id')
    .get(ctrlECodes.eCodeGetOne)


//*********For Freeze Frame*********/
router
    .route('/freeze_frame')
    .post(ctrlFreezeFrame.freezeFrameAddAll)
    .get(ctrlFreezeFrame.freezeFrameGetAll)

router
    .route('/freeze_frame/:id')
    .get(ctrlFreezeFrame.freezeFrameGetOne)

module.exports = router;
