const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotion');

router.post('/', promotionController.createPromotion);
router.get('/', promotionController.getPromotions);
router.put('/:id', promotionController.updatePromotion);
router.delete('/:id', promotionController.deletePromotion);

module.exports = router;
