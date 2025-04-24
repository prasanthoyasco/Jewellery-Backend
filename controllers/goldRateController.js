import GoldRate from '../models/GoldRate.js';

export const getGoldRates = async (req, res, next) => {
  try {
    const rates = await GoldRate.find();

    const formattedRates = rates.map(rate => ({
      karat: rate.karat,
      ratePerGram: rate.ratePerGram,
      ratePerPoun: rate.ratePerPoun,
      updatedAt: rate.updatedAt,
    }));

    res.json(formattedRates);
  } catch (err) {
    next(err);
  }
};

export const updateGoldRate = async (req, res, next) => {
  try {
    const { karat, ratePerGram } = req.body;

    if (!karat || !ratePerGram) {
      return res.status(400).json({ message: 'karat and ratePerGram are required' });
    }

    const ratePerPoun = ratePerGram * 8.0;

    const updated = await GoldRate.findOneAndUpdate(
      { karat },
      { ratePerGram, ratePerPoun },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
