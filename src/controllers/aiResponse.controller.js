import { AIResponse } from "../models/aiResponse.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createAIResponse = asyncHandler(async (req, res) => {
  const { aiResponse, templateSlugName, formData } = req.body;
  const userId = req.user?._id;
  const errors = [];
  
  // Validate inputs
  if (!aiResponse) {
    errors.push("AI response is required");
  }
  if (!templateSlugName) {
    errors.push("Template slug name is required");
  }
  if (!formData) {
    errors.push("Form data is required");
  }
  if (!userId) {
    errors.push("User ID is required");
  }

  // If there are validation errors, return them
  if (errors.length > 0) {
    return res.status(400).json(new ApiError(400, "Validation failed", errors));
  }
  try {
    // Create a new AIResponse entry
    const newAIResponse = new AIResponse({
      aiResponse,
      templateSlugName,
      formData,
      userId,
    });

    await newAIResponse.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, newAIResponse, "AI response created successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Error creating AI response", [error.message]));
  }
});

const getAIResponse = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const errors = [];

  if (!userId) {
    errors.push("User ID is required");
  }

  if (errors.length > 0) {
    return res.status(400).json(new ApiError(400, "Validation failed", errors));
  }
  const aiResponses = await AIResponse.find({ userId });

  if (!aiResponses) {
    return res.status(404).json(new ApiError(404, "No AI responses found"));
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, aiResponses, "AI responses fetched successfully")
    );
});

export { createAIResponse, getAIResponse };
