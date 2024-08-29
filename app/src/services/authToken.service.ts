import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { get } from "../../config/config";
import { responseHandler } from "./responseHandler.service";
import { resCode } from "../../constants/res.code";
import { msg } from "../../constants/en";

const config = get(process.env.NODE_ENV);

/* VERIFY AUTH TOKEN */
const verifyAuthToken: RequestHandler = (req: any, res, next) => {
    const token = req.header("token");
    if (!token) return responseHandler.sendResponse(req, res, resCode.FORBIDDEN, msg.unauthorize)
    try {
        const decoded = jwt.verify(token, config.SECURITY_TOKEN as string);
        req.user = decoded;
        next();
    } catch (err: any) {
        console.log(err);
        return responseHandler.sendResponse(req, res, resCode.BAD_REQUEST, err)
    }
};

/* GENERATE AUTH TOKEN */
const generateAuthToken = (user: any) => {
    const payload = {
        id: user.id,
        email: user.email,
    };
    return jwt.sign(payload, config.SECURITY_TOKEN as string, { expiresIn: config.TOKEN_EXPIRES_IN });
};

/* GENERATE REFRESH TOKEN */
const generateRefreshToken = (user: any) => {
    const payload = {
        id: user.user_id,
        email: user.email,
    };
    return jwt.sign(payload, config.SECURITY_TOKEN as string, { expiresIn: config.REFRESH_TOKEN_EXPIRES_IN });
};

/* GENERATE FORGOT PASSWORD TOKEN */
const generateForgotPasswordToken = (user: any) => {
    const payload = {
        id: user.id,
        email: user.email,
    };
    return jwt.sign(payload, config.SECURITY_TOKEN as string, { expiresIn: config.TOKEN_EXPIRES_IN });
};

export const authToken = {
    generateAuthToken,
    verifyAuthToken,
    generateRefreshToken,
    generateForgotPasswordToken
};