import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateToken = async (userId) => {
  try {
    const user = await User.findById({ _id: userId });

    const accessToken = user.generateAccessToken();

    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token",
      ["Something went wrong while generating referesh and access token"]
    );
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username) {
    errors.push("Username is required");
  }
  if (!email) {
    errors.push("Email is required");
  }
  if (!password) {
    errors.push("Password is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.push("Email format is invalid");
  }
  if (password && password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (errors.length > 0) {
    return res.status(400).json(new ApiError(400, "Validation failed", errors));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json(
        new ApiError(409, "User already exists", [
          "User with this email already exists",
        ])
      );
  }

  const user = await User.create({
    email,
    password,
    username,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    return res
      .status(500)
      .json(
        new ApiError(500, "Something went wrong while registering the user", [
          "Something went wrong while registering the user",
        ])
      );
  }
  const { accessToken } = await generateToken(createdUser?._id);
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };
  return res
    .status(201)
    .cookie("token", accessToken, options)
    .json(
      new ApiResponse(
        200,
        createdUser,
        "User registered Successfully",
        accessToken
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push("Email is required");
  }
  if (!password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json(new ApiError(400, "Validation failed", errors));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json(new ApiError(404, "User does not exist", ["User does not exist"]));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res
      .status(401)
      .json(
        new ApiError(401, "Invalid user credentials", [
          "Invalid user credentials",
        ])
      );
  }

  const loggedInUser = await User.findById(user._id).select("-password");
  const { accessToken } = await generateToken(loggedInUser?._id);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res.status(200).cookie("token", accessToken, options).json(
    new ApiResponse(
      200,
      loggedInUser,
      "User logged In Successfully",
      accessToken
    )
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res
    .status(200)
    .clearCookie("token", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  if (!req?.user._id) {
    return res
      .status(400)
      .json(new ApiError(400, "userID  are required", ["userID are required"]));
  }
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res
      .status(400)
      .json(new ApiError(400, "user not found", ["user Not found"]));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Profile Fetched successfully"));
});

export { registerUser, loginUser, logoutUser, getUserProfile };
