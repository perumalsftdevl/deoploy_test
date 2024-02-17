import Express from "express";
import verifyToken from "../utils/verifyToken.js";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/errorHandler.js";
import mongoose from "mongoose";
import verifyUserToken from "../utils/verifyUser.js";
import ListingModel from "../Models/Listing.model.js";

const router = Express.Router();

router.get("/getListing", async (req, res, next) => {
  try {
    const Listing = await ListingModel.find({ _id: req.query.id }).sort({
      createdAt: "descending",
    });
    return res.status(200).json({
      status: true,
      message: "Listing Fetch SuccessFully",
      record: Listing,
    });
  } catch (error) {
    return next(error);
  }
});
router.get("/getListingByUserId", verifyUserToken, async (req, res, next) => {
  try {
    const Listing = await ListingModel.find({ UserRef: req.query.id }).sort({
      createdAt: "descending",
    });
    return res.status(200).json({
      status: true,
      message: "Listing Fetch SuccessFully",
      record: Listing,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/DeleteListingById", verifyUserToken, async (req, res, next) => {
  try {
    const Find = await ListingModel.find({ _id: req.query.id });
    if (Find.length == 0) {
      return res.status(200).json({
        status: true,
        message: "Listing has been Already Deleted SuccessFully",
      });
    } else {
      await ListingModel.findOneAndDelete({ _id: req.query.id });
      return res.status(200).json({
        status: true,
        message: "Listing has been Deleted SuccessFully",
      });
    }
  } catch (error) {
    return next(error);
  }
});
router.get("/EditListingById", verifyUserToken, async (req, res, next) => {
  try {
    const Find = await ListingModel.findById({ _id: req.query.id });
    if (Find.length == 0) {
      return res.status(200).json({
        status: true,
        message: "No record Found",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Listing Added SuccessFully",
        record: Find,
      });
    }
  } catch (error) {
    return next(error);
  }
});

router.post("/UpdateListing", async (req, res, next) => {
  const Listing = await ListingModel.findById(req.query.id);
  if (!Listing) {
    return next(errorHandler(404, "Listing Not Found"));
  }

  try {
    await ListingModel.findByIdAndUpdate(req.query.id, req.body, { new: true });
    return res.status(200).json({
      status: true,
      message: "Listing Update SuccessFully",
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/create", async (req, res, next) => {
  try {
    const Listing = await ListingModel.create(req.body);
    return res.status(200).json({
      status: true,

      message: "Listing Added SuccessFully",
      record: Listing,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/SearchListingById", async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 9;
  const startIndex = parseInt(req.query.startIndex) || 0;
  let offer = req.body.offer;
  let query = {};
  if (offer === undefined || offer === "false") {
    offer = { $in: [false, true] };
  }

  let furnished = req.body.furnished;
  if (furnished === undefined || furnished === "false") {
    furnished = { $in: [false, true] };
  }
  let parking = req.body.parking;
  if (parking === undefined || parking === "false") {
    parking = { $in: [false, true] };
  }
  let type = req.body.type;
  if (type === undefined || type === "all") {
    type = { $in: ["sale", "rent", ""] };
  }

  const searchTerm = req.query.searchTerm || "";
  const sort = req.query.sort || "createdAt";
  const order = req.query.order || "desc";

  try {
    const Listing = await ListingModel.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { address: { $regex: searchTerm, $options: "i" } },
      ],
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json({
      status: true,
      message: "Listing Added SuccessFully",
      record: Listing,
    });
  } catch (error) {
    return next(error);
  }
});

const ListingRouter = router;

export default ListingRouter;
