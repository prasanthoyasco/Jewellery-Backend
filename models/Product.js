import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  karat: { type: String, enum: ['24k', '22k', '18k'], required: true },
  shortdiscription:{ type: String, required:true},
  productid: {type: String},
  image: { type: String },
  weight: { type: Number, required: true },
  makingCostPercent: { type: Number, required: true },
  wastagePercent: { type: Number, required: true },
  price: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
