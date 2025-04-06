const Promotion = require('../models/Promotion');
const Product = require('../models/Product');

// CREATE
exports.createPromotion = async (req, res) => {
  try {
    const promotion = await Promotion.create(req.body);

    // TODO: Trigger push notification here

    res.status(201).json({ message: 'Promotion created', promotion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating promotion' });
  }
};

// READ ALL
exports.getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find()
    res.json({ promotions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching promotions' });
  }
};

// UPDATE
exports.updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Promotion updated', promotion });
  } catch (error) {
    res.status(500).json({ message: 'Error updating promotion' });
  }
};

// DELETE
exports.deletePromotion = async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Promotion deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting promotion' });
  }
};
