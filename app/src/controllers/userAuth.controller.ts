import { msg } from "../../constants/en";
import { resCode } from "../../constants/res.code";
import userModel from "../models/user.model";
import userAuthModel from "../models/userAuth.model";
import { userSchemaValidation } from "../schemaValidation/user.Validation";
import { userAuthValidation } from "../schemaValidation/userAuth.validation";
import { authToken } from "../services/authToken.service";
import commonQuery from "../services/commanQuery.service";
import { comparePasswords, hashPassword } from "../services/password.service";
import { responseHandler } from "../services/responseHandler.service";
import { emailHandler } from "../services/emailHandler.service";
import otpModel from "../models/otp.model";
import { get } from "../../config/config";
import jwt from "jsonwebtoken";
import { log } from "console";
import z from "zod";

const config = get(process.env.NODE_ENV);

const userLogin = async (req: any, res: any, next: any) => {
    try {
        const payload: any = userSchemaValidation.loginSchema.parse(req.body);
        let control = new commonQuery(userModel);
        let filter = { email: payload.email };
        let projection = {};
        let userDetails: any = await control.getData(filter, projection)
        userDetails = userDetails.toObject()
        const isMatch = await comparePasswords(payload.password, userDetails.password);
        if (!isMatch) {
            return responseHandler.respondWithFailed(res, resCode.BAD_REQUEST, msg.auth.passwordInvalid);
        }
        if (userDetails.is_2FA) {
            const otp = Math.floor(100000 + Math.random() * 900000);
            const emailbody = `Dear ${userDetails.first_name} You OTP is ${otp} for login.`
            const otpControl = new commonQuery(otpModel)
            await otpControl.create({ user_id: userDetails._id, user_email: userDetails.email, otp: otp })
            await emailHandler.sendMail(req.body.email, "Login Request", emailbody)
            return responseHandler.respondWithSuccessData(res, resCode.OK, msg.otp.otpSend, { email: userDetails.email });
        } else {
            const token = await authToken.generateAuthToken({ id: userDetails._id, email: userDetails.email });
            const refToken = await authToken.generateRefreshToken({ id: userDetails._id, email: userDetails.email })
            let authControl = new commonQuery(userAuthModel);
            let userAuthData = await authControl.getData({ user_id: userDetails._id })
            if (userAuthData) {
                await authControl.updateData(userDetails._id,
                    {
                        "auth_token": token,
                        "ref_token": refToken
                    })
            } else {
                await authControl.create({
                    "user_id": userDetails._id,
                    "auth_token": token,
                    "ref_token": refToken
                })
            }
            return responseHandler.respondWithSuccessData(res, resCode.OK, msg.loginSuccess, { token, refToken, ...userDetails });
        }
    }
    catch (error: any) {
        console.error(error, "Error");
        if (error instanceof z.ZodError) {
            return responseHandler.respondWithFailed(res, resCode.BAD_REQUEST, error.errors);
        }
        return responseHandler.handleInternalError(error, next);
    }
};

const forgotPassword = async (req: any, res: any, next: any) => {
    try {
        const userControl = new commonQuery(userModel);
        const userDetails: any = await userControl.getData({ email: req.body.email })
        if (!userDetails) {
            return responseHandler.respondWithFailed(res, resCode.BAD_REQUEST, msg.auth.emailNotExist);
        }
        const token = await authToken.generateAuthToken({ id: userDetails._id, email: userDetails.email });
        const emailbody = `
        Dear ${userDetails.first_name},
        
        You have requested a password reset. Click the link below to reset your password:
        
        <a href="http://localhost:3002/api/users/auth/reset-password?token=${token}">Click Here</a>
      `;
        await emailHandler.sendMail(req.body.email, "Forgot Password Request", emailbody)
        return responseHandler.respondWithSuccessNoData(res, resCode.OK, msg.auth.forgetPassword);
    }
    catch (error: any) {
        console.error(error, "Error");
        return responseHandler.handleInternalError(error, next);
    }
};

const resetPassword = async (req: any, res: any, next: any) => {
    try {
        let parsedBody = userAuthValidation.resetPasswordSchema.parse(req.body);
        const password = await hashPassword(parsedBody.new_password)
        const userControl = new commonQuery(userModel)
        await userControl.updateData(req.user.id, { "password": password })
        return responseHandler.respondWithSuccessNoData(res, resCode.OK, msg.auth.passwordUpdated);
    }
    catch (error: any) {
        console.error(error, "Error");
        if (error instanceof z.ZodError) {
            return responseHandler.respondWithFailed(res, resCode.BAD_REQUEST, error.errors);
        }
        return responseHandler.handleInternalError(error, next);
    }
};

const changePassword = async (req: any, res: any, next: any) => {
    try {
        const payload: any = userAuthValidation.changePasswordSchema.parse(req.body);
        let control = new commonQuery(userModel);
        let filter = { email: req.user.email };
        let projection = {};
        let userDetails: any = await control.getData(filter, projection)

        const isMatch = await comparePasswords(payload.old_password, userDetails.password);
        if (!isMatch) {
            return responseHandler.respondWithFailed(res, resCode.BAD_REQUEST, msg.auth.passwordInvalid);
        }
        const newPassword = await hashPassword(payload.new_password)
        await control.updateData(userDetails._id, { "password": newPassword })
        return responseHandler.respondWithSuccessNoData(res, resCode.OK, msg.auth.passwordUpdated);
    }
    catch (error: any) {
        console.error(error, "Error");
        if (error instanceof z.ZodError) {
            return responseHandler.respondWithFailed(res, resCode.BAD_REQUEST, error.errors);
        }
        return responseHandler.handleInternalError(error, next);
    }
};

const otpVerify = async (req: any, res: any, next: any) => {
    try {
        const otpControl = new commonQuery(otpModel)
        const otpDetails: any = await otpControl.getData({ user_email: req.body.email })

        if (!otpDetails) {
            return responseHandler.sendResponse(req, res, resCode.BAD_REQUEST, null, null, null, msg.otp.otpnotExist)
        }
        if (req.body.otp != otpDetails.otp) {
            return responseHandler.sendResponse(req, res, resCode.BAD_REQUEST, null, null, null, msg.otp.otpWrong)
        }

        await otpControl.deleteDataById(otpDetails._id)
        let control = new commonQuery(userModel);
        let filter = { email: req.body.email };
        let projection = {};
        let userDetails: any = await control.getData(filter, projection)

        const token = await authToken.generateAuthToken({ id: userDetails._id, email: userDetails.email });
        const refToken = await authToken.generateRefreshToken({ id: userDetails._id, email: userDetails.email })
        let authControl = new commonQuery(userAuthModel);
        let userAuthData = await authControl.getData({ user_id: userDetails._id })
        if (userAuthData) {
            await authControl.updateData(userDetails._id,
                {
                    "auth_token": token,
                    "ref_token": refToken
                })
        } else {
            await authControl.create({
                "user_id": userDetails._id,
                "auth_token": token,
                "ref_token": refToken
            })
        }
        return responseHandler.respondWithSuccessData(res, resCode.OK, msg.otp.otpVerified, { token, ...userDetails });

        // return responseHandler.sendResponse(req, res, resCode.OK, msg.otp.otpVerified)
    }
    catch (error: any) {
        console.error(error, "Error");
        return responseHandler.handleInternalError(error, next);
    }
};

const logOut = async (req: any, res: any, next: any) => {
    try {
        const authControl = new commonQuery(userAuthModel)
        console.log(req.user.id);
        await authControl.deleteData({ user_id: req.user.id })
        return responseHandler.respondWithSuccessNoData(res, resCode.OK, msg.auth.loggedOut)
    }
    catch (error: any) {
        console.error(error, "Error");
        return responseHandler.handleInternalError(error, next);
    }
};

const getToken = async (req: any, res: any, next: any) => {
    try {
        const refreshToken = req.header("ref_token");

        const payload = await jwt.verify(refreshToken, config.SECURITY_TOKEN as string)

        const token = await authToken.generateRefreshToken(payload)

        return responseHandler.respondWithSuccessData(res, resCode.OK, msg.auth.tokenGenerated, token)
    }
    catch (error: any) {
        console.error(error, "Error");
        return responseHandler.handleInternalError(error, next);
    }
};

export const userAuthControl = {
    userLogin, forgotPassword, resetPassword, changePassword, otpVerify, logOut, getToken
}