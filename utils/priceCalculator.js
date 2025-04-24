export const calculatePrice = (weight, ratePerGram, makingCostPercent, wastagePercent) => {
  const w = parseFloat(weight);
  const r = parseFloat(ratePerGram);
  const m = parseFloat(makingCostPercent);
  const ws = parseFloat(wastagePercent);

  if ([w, r, m, ws].some(isNaN)) return NaN;

  const basePrice = w * r;
  const makingCost = (m / 100) * basePrice;
  const wastage = (ws / 100) * basePrice;

  return Math.round(basePrice + makingCost + wastage);
};
