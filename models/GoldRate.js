import mongoose from 'mongoose';

const goldRateSchema = new mongoose.Schema(
  {
    karat: {
      type: String,
      required: true,
      enum: ['24k', '22k', '18k'],
      unique: true,
    },
    ratePerGram: {
      type: Number,
      required: true,
    },
    ratePerPoun: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('GoldRate', goldRateSchema);
