import express from 'express';
import { getGoldRates, updateGoldRate } from '../controllers/goldRateController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: GoldRates
 *   description: Gold rate management
 */

/**
 * @swagger
 * /api/gold-rates:
 *   get:
 *     summary: Get current gold rates for all karats
 *     tags: [GoldRates]
 *     responses:
 *       200:
 *         description: List of gold rates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GoldRate'
 */
router.get('/', getGoldRates);

/**
 * @swagger
 * /api/gold-rates:
 *   post:
 *     summary: Set or update the gold rate for a karat
 *     tags: [GoldRates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - karat
 *               - ratePerGram
 *             properties:
 *               karat:
 *                 type: string
 *                 enum: [24k, 22k, 18k]
 *               ratePerGram:
 *                 type: number
 *                 example: 6000.00
 *     responses:
 *       200:
 *         description: Gold rate updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoldRate'
 *       400:
 *         description: Invalid input or missing data
 */
router.post('/', updateGoldRate);

export default router;
