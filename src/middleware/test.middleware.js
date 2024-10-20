import mongoose from "mongoose";
import { Result } from "../model/result.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asynchandlar } from "../utils/asynchandler.js";

const isScoreGenerated = asynchandlar(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { courseId, id: testId } = req.body;

        if (!userId || !courseId) {
            throw new ApiError(400, "Data missing");
        }

        const isTestGiven = await Result.findOne({
            'userId': userId,
            'courseId': courseId,
            'quizId': testId // Ensure this is correct
        }).select("-userId -courseId -quizId");
        console.log(isTestGiven);
        if (isTestGiven) {
            return res.status(200).json(
                new ApiResponse(200, isTestGiven, "", "You have already given this test.")
            );
        }

        next(); // Proceed if test is not found
    } catch (error) {
        throw new ApiError(404, "Invalid data", error);
    }
});

export default isScoreGenerated;
