const adminController = require("../controllers/adminController");
const express = require('express');

const router = express.Router();

router.get('/', adminController.getAllAdmins);
// router.get('/active', restaurantController.getAllActiveRestaurants);
// router.get('/photo/:uid', restaurantController.getRestaurantPhoto);
router.get('/:id', adminController.getAdminById);

router.post('/register', adminController.createAdmin);
router.post('/login', adminController.adminLogin);
// router.post('/favourite', restaurantController.getAllFavouriteRestaurants);

// router.patch('/update/:uid', restaurantController.updateRestaurntByUID);
// router.patch('/package-activation/:uid', restaurantController.packageActivation);
// router.patch('/photo/add/:uid', restaurantController.addRestaurantPhoto);

// router.delete('/photo/remove/:uid', restaurantController.removeRestaurantPhoto);

module.exports = router;