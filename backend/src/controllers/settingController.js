import Setting from "../models/Setting.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getOrCreate = async () => {
  let s = await Setting.findOne({ key: "global" });
  if (!s) s = await Setting.create({ key: "global" });
  return s;
};

// @route GET /api/settings  (public)
export const getSettings = asyncHandler(async (req, res) => {
  const s = await getOrCreate();
  res.json(s);
});

// @route PUT /api/settings  (admin)
export const updateSettings = asyncHandler(async (req, res) => {
  const s = await getOrCreate();
  const fields = [
    "logoText", "announcements", "whatsapp", "phone", "email", "hours",
    "freeShippingThreshold", "shippingFlat", "baseCurrency", "currencies",
  ];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) s[f] = req.body[f];
  });
  res.json(await s.save());
});
