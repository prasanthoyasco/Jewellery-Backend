import Product from '../models/Product.js';
import GoldRate from '../models/GoldRate.js';
import cloudinary from "../config/cloudinary.js";

const uploadImageToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const addProduct = async (req, res, next) => {
  try {
    let image = null;

    if (req.file) {
      try {
        image = await uploadImageToCloudinary(req.file.buffer);
      } catch (error) {
        return res.status(500).json({ message: "Image upload failed", error });
      }
    }
    const { name, karat, shortdiscription, productid, weight, makingCostPercent, wastagePercent } = req.body;

    const goldRate = await GoldRate.findOne({ karat });
    if (!goldRate || !goldRate.ratePerGram) {
      return res.status(400).json({ message: 'Gold rate not set for this karat.' });
    }

    // Convert inputs to numbers
    const parsedWeight = parseFloat(weight);
    const parsedMaking = parseFloat(makingCostPercent);
    const parsedWastage = parseFloat(wastagePercent);
    const parsedRate = parseFloat(goldRate.ratePerGram);

    if ([parsedWeight, parsedMaking, parsedWastage, parsedRate].some(isNaN)) {
      return res.status(400).json({ message: 'Invalid input: weight, rate, or percentage values are not numbers.' });
    }

    const basePrice = parsedWeight * parsedRate;
    const makingCost = (parsedMaking / 100) * basePrice;
    const wastageCost = (parsedWastage / 100) * basePrice;
    const totalPrice = Math.round(basePrice + makingCost + wastageCost);

    const product = new Product({
      name,
      karat,
      shortdiscription,
      productid,
      image,
      weight: parsedWeight,
      makingCostPercent: parsedMaking,
      wastagePercent: parsedWastage,
      price: totalPrice,
      makingCost: Math.round(makingCost),
      wastageCost: Math.round(wastageCost),
      goldRatePerGram: Math.round(parsedRate),
    });

    await product.save();

    res.status(201).json({
      ...product.toObject(),
      makingCost: Math.round(makingCost),
      wastageCost: Math.round(wastageCost),
      goldRatePerGram: Math.round(parsedRate),
    });
  } catch (err) {
    next(err);
  }
};


export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    const productsWithCalculatedData = await Promise.all(
      products.map(async (product) => {
        const goldRate = await GoldRate.findOne({ karat: product.karat });
        if (!goldRate || !goldRate.ratePerGram) {
          return { ...product.toObject(), error: 'Gold rate not found for this karat.' };
        }

        const parsedWeight = parseFloat(product.weight);
        const parsedMaking = parseFloat(product.makingCostPercent);
        const parsedWastage = parseFloat(product.wastagePercent);
        const parsedRate = parseFloat(goldRate.ratePerGram);

        const basePrice = parsedWeight * parsedRate;
        const makingCost = (parsedMaking / 100) * basePrice;
        const wastageCost = (parsedWastage / 100) * basePrice;
        const totalPrice = Math.round(basePrice + makingCost + wastageCost);

        return {
          ...product.toObject(),
          makingCost: Math.round(makingCost),
          wastageCost: Math.round(wastageCost),
          price: totalPrice,
          goldRatePerGram: parsedRate,
        };
      })
    );
    res.json(productsWithCalculatedData);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const goldRate = await GoldRate.findOne({ karat: product.karat });
    if (!goldRate || !goldRate.ratePerGram) {
      return res.status(400).json({ message: 'Gold rate not set for this karat.' });
    }

    const parsedWeight = parseFloat(product.weight);
    const parsedMaking = parseFloat(product.makingCostPercent);
    const parsedWastage = parseFloat(product.wastagePercent);
    const parsedRate = parseFloat(goldRate.ratePerGram);

    const basePrice = parsedWeight * parsedRate;
    const makingCost = (parsedMaking / 100) * basePrice;
    const wastageCost = (parsedWastage / 100) * basePrice;
    const totalPrice = Math.round(basePrice + makingCost + wastageCost);

    res.json({
      ...product.toObject(),
      makingCost: Math.round(makingCost),
      wastageCost: Math.round(wastageCost),
      price: totalPrice,
      goldRatePerGram: parsedRate,
    });
  } catch (err) {
    next(err);
  }
};


export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const updateProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, karat, shortdiscription, productid, weight, makingCostPercent, wastagePercent } = req.body;
    let image = null;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const goldRate = await GoldRate.findOne({ karat });
    if (!goldRate || !goldRate.ratePerGram) {
      return res.status(400).json({ message: 'Gold rate not set for this karat.' });
    }

    const parsedWeight = parseFloat(weight);
    const parsedMaking = parseFloat(makingCostPercent);
    const parsedWastage = parseFloat(wastagePercent);
    const parsedRate = parseFloat(goldRate.ratePerGram);

    if ([parsedWeight, parsedMaking, parsedWastage, parsedRate].some(isNaN)) {
      return res.status(400).json({ message: 'Invalid input: weight, rate, or percentage values are not numbers.' });
    }

    const basePrice = parsedWeight * parsedRate;
    const makingCost = (parsedMaking / 100) * basePrice;
    const wastageCost = (parsedWastage / 100) * basePrice;
    const totalPrice = Math.round(basePrice + makingCost + wastageCost);

    const updateData = {
      name,
      karat,
      shortdiscription,
      productid,
      weight: parsedWeight,
      makingCostPercent: parsedMaking,
      wastagePercent: parsedWastage,
      price: totalPrice,
      makingCost: Math.round(makingCost),
      wastageCost: Math.round(wastageCost),
      goldRatePerGram: Math.round(parsedRate),
    };

    if (req.file) {
      try {
        image = await uploadImageToCloudinary(req.file.buffer);
        updateData.image = image;
      } catch (error) {
        return res.status(500).json({ message: "Image upload failed", error });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(500).json({ message: 'Failed to update product.' });
    }

    res.json({
      ...updatedProduct.toObject(),
      makingCost: Math.round(makingCost),
      wastageCost: Math.round(wastageCost),
      goldRatePerGram: Math.round(parsedRate),
    });

  } catch (err) {
    next(err);
  }
};