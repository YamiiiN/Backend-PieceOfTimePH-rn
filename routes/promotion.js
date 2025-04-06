const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotion');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

router.post('/', isAuthenticated, promotionController.createPromotion);
router.get('/', isAuthenticated,  promotionController.getPromotions);
router.put('/:id', isAuthenticated, promotionController.updatePromotion);
router.delete('/:id', isAuthenticated, promotionController.deletePromotion);

module.exports = router;
