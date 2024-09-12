import { catchAsyncError } from '../middleware/catchAsyncError.js';
import { Message } from '../models/messageSchema.js';
import ErrorHandler from '../middleware/error.js'

export const sendMessage = catchAsyncError(async (req, res, next) => {
    const { firstName, lastName, email, phone, message } = req.body;

    // Check if all required fields are present
    if (!firstName || !lastName || !email || !phone || !phone || !message) {
        return next(new ErrorHandler("Please Fill The Form", 400));
    }

    await Message.create({ firstName, lastName, email, phone, message });
    res.status(200).json({
        success: true,
        message: "Message Sent!",
    });
});

export const getAllMessages = catchAsyncError(async (req, res, next) => {
    const messages = await Message.find();
    res.status(200).json({
        success: true,
        messages,
    });
});


