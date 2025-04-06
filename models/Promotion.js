// const mongoose = require('mongoose');

// const promotionSchema = new mongoose.Schema({
//     category: {
//       type: String,
//       required: [true, 'Please select category for this promotion'],
//       enum: {
//         values: [
//           "Classic",
//           'Dive',
//           'Pilot',
//           'Field',
//           'Dress',
//           'Chronograph',
//           'Moon Phase',
//           'Vintage'
//         ],
//         message: 'Please select correct category for promotion'
//       }
//     },
//   title: {
//     type: String,
//     required: [true, 'Promotion title is required.'],
//   },
//   description: {
//     type: String,
//   },
//   discountPercentage: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 100,
//   },
//   startDate: {
//     type: Date,
//     required: true,
//   },
//   endDate: {
//     type: Date,
//     required: true,
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Promotion', promotionSchema);


const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Please select a product for this promotion']
  },
  title: {
    type: String,
    required: [true, 'Promotion title is required'],
  },
  description: {
    type: String,
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema);