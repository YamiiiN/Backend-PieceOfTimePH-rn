const Promotion = require('../models/Promotion');
const Product = require('../models/Product');
const User = require('../models/User');
const Notification = require('../models/Notification');
const notificationService = require('../services/notificationService');

exports.createPromotion = async (req, res) => {
  try {
  
    const product = await Product.findById(req.body.product);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const promotion = await Promotion.create(req.body);

    const users = await User.find({ 
      role: 'user', 
      pushToken: { $exists: true, $ne: null } 
    });

    
    const notificationPromises = users.map(user => {
      const notification = new Notification({
        user: user._id, 
        title: 'New Promotion',
        message: `Get ${product.name} with ${promotion.discountPercentage}% off. Grab the item now!`,
        type: 'promo',
        data: {
          promotionId: promotion._id,
          productId: product._id,
          discount: promotion.discountPercentage,
        },
      });
      return notification.save();
    });

    await Promise.all(notificationPromises);

    
    if (users.length > 0) {
      const pushTokens = users.map(u => u.pushToken);
      
      await notificationService.sendNotification(
        pushTokens,
        'New Promotion',
        `Get ${product.name} with ${promotion.discountPercentage}% off. Grab the item now!`,
        { 
          promotionId: promotion._id.toString(),
          productId: product._id.toString()
        }
      );
    }

    res.status(201).json({ success: true, promotion });

  } catch (error) {
    console.error('Error creating promotion:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
// READ ALL 
exports.getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find()
      .populate('product', 'name price images'); 
    res.json({ success: true, promotions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching promotions' });
  }
};

// UPDATE (with product verification)
exports.updatePromotion = async (req, res) => {
  try {
    if (req.body.product) {
      const product = await Product.findById(req.body.product);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
    }

    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).populate('product', 'name');

    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found' });
    }

    res.json({ success: true, promotion });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating promotion' });
  }
};

// DELETE (unchanged)
exports.deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found' });
    }
    res.json({ success: true, message: 'Promotion deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting promotion' });
  }
};