const express = require('express');
const adminRouter = require('./Admin');

const VendorRouter = require('./vendorRoutes');
const CustomerRouter = require('./formRoute');
const router = express.Router();

router.use('/admin', adminRouter);
router.use('/customer', CustomerRouter);
router.use("/vendors",VendorRouter);

module.exports = router;