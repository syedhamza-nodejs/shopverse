import Banner from "../models/Banner.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route GET /api/banners  (public — active only, sorted)
export const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({ active: true }).sort({ order: 1, createdAt: 1 }).lean();
  res.json(banners);
});

// @route GET /api/banners/all  (admin — includes inactive)
export const getAllBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort({ order: 1, createdAt: 1 }).lean();
  res.json(banners);
});

// @route POST /api/banners  (admin)
export const createBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json(banner);
});

// @route PUT /api/banners/:id  (admin)
export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }
  Object.assign(banner, req.body);
  res.json(await banner.save());
});

// @route DELETE /api/banners/:id  (admin)
export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }
  res.json({ message: "Banner removed" });
});
