import Razorpay from "razorpay";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { AIResponse } from "../models/aiResponse.model.js";

const createSubscription = asyncHandler(async (req, res) => {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });

  try {
    const result = await instance.subscriptions.create({
      plan_id: process.env.SUBSCRIPTION_PLAN_ID,
      customer_notify: 1,
      quantity: 1,
      total_count: 1,
      addons: [],
      notes: {
        key1: "Note",
      },
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        result,
        "Subscription created"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Error creating subscription", [error.message]);
  }
});

const paymentSaved = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { paymentId } = req.body;


  // Validate input
  if (!paymentId || !userId) {

    return res
      .status(400)
      .json(
        new ApiError(400, "userID and paymentId are required", [
          "userID and paymentId are required",
        ])
      );
  }

  const user = await User.findById(userId);
  if (!user) {
    return res
      .status(404)
      .json(new ApiError(404, "User not found", ["User not found"]));
  }

  user.active = true;
  user.paymentId = paymentId;

  await user.save();

  // Return success response
  return res.status(201).json(
    new ApiResponse(
      201,
      user,
      "Payment done successfully"
    )
  );
});



export { createSubscription, paymentSaved };
