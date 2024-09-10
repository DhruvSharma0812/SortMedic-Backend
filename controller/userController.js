import { catchAsyncError } from '../middleware/catchAsyncError.js'
import { User } from "../models/userSchema.js"
import ErrorHandler from "../middleware/error.js"
import {generateToken} from "../utils/jwtTokens.js"

export const patientRegister = catchAsyncError(async (req, res, next) => {
    const { firstName, lastName, email, phone, Aadhar, dob, gender, password } = req.body;
    if (!firstName || !lastName || !email || !phone || !Aadhar || !dob || !gender || !password) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler("User already Registered!", 400));
    }

    const user = await User.create({
        firstName, lastName, email, phone, Aadhar, dob, gender, password, role: "Patient",
    });

    generateToken (user, "User Registerd", 200, res);
});

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;
    if (!email || !password || !confirmPassword || !role) {
        return next(new ErrorHandler("Please Provide all details", 400));
    }
    if (password !== confirmPassword) {
        return next(
            new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
        );
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email Or Password!", 400));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Email Or Password!", 400));
    }
    if (role !== user.role) {
        return next(new ErrorHandler(`User Not Found With This Role!`, 400));
    }

    generateToken(user, "Logged In Successfully", 200, res);
});

