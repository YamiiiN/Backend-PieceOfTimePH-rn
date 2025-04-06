const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotion');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

router.post('/',  promotionController.createPromotion);
router.get('/',  promotionController.getPromotions);
router.put('/:id', promotionController.updatePromotion);
router.delete('/:id', promotionController.deletePromotion);

module.exports = router;
