import { Request, Response } from 'express';
import User from '../models/user.model';
import { userSchemaValidation } from '../schemaValidation/user.Validation';
import { z } from 'zod';
import { responseHandler } from '../services/responseHandler.service';
import { resCode } from '../../constants/res.code';
import { msg } from '../../constants/en';
import commonQuery from '../services/commanQuery.service';
import { hashPassword } from '../services/password.service';

const createUser = async (req: Request, res: Response, next: any) => {
  try {
    if (req.file) {
      const filePath: any = req.file
      req.body.profile_picture = filePath.path
    }
    let parsedBody = userSchemaValidation.createSchema.parse(req.body);
    console.log(parsedBody, "parsedbody");
    let control = new commonQuery(User)
    parsedBody.password = await hashPassword(parsedBody.password)
    let userData = await control.create(parsedBody)
    return responseHandler.respondWithSuccessData(res, resCode.CREATED, msg.dataInsertSuccess, userData)
  } catch (error: any) {
    console.error(error, "Error");
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return responseHandler.respondWithFailed(res, resCode.BAD_REQUEST, msg.auth.emailAlreadyExist);
    }
    if (error instanceof z.ZodError) {
      return responseHandler.respondWithFailed(res, resCode.BAD_REQUEST, error.errors);
    }
    return responseHandler.handleInternalError(error, next);
  }
};

const getUsers = async (req: Request, res: Response, next: any) => {
  try {
    console.log("user-list");

    let control = new commonQuery(User)
    const users = await control.getAllData()
    return responseHandler.respondWithSuccessData(res, resCode.OK, msg.dataFetchSuccess, users)
  } catch (error: any) {
    console.error(error, "Error");
    return responseHandler.handleInternalError(error, next);
  }
};

const getUserById = async (req: Request, res: Response, next: any) => {
  try {
    console.log("user-by-id");

    let control = new commonQuery(User)
    const user = await control.getData({ _id: req.params.id }, {
      first_name: 1,
      last_name: 1,
      email: 1,
      age: 1,
      profile_picture: 1
    }) // for projection pass 1 with key you wanted in obj
    if (!user) {
      return responseHandler.respondWithFailed(res, resCode.NOT_FOUND, msg.userNotFoundWithSpecifiedID)
    }
    return responseHandler.respondWithSuccessData(res, resCode.OK, msg.dataFetchSuccess, user)
  } catch (error: any) {
    console.error(error, "Error");
    return responseHandler.handleInternalError(error, next);
  }
};

const updateUser = async (req: Request, res: Response, next: any) => {
  try {
    if (req.file) {
      const filePath: any = req.file
      req.body.profile_picture = filePath.path
    }
    const parsedBody = userSchemaValidation.updateSchema.parse(req.body);
    let control = new commonQuery(User)

    const user = await control.updateData(req.params.id, parsedBody)
    if (!user) {
      return responseHandler.respondWithFailed(res, resCode.NOT_FOUND, msg.userNotFoundWithSpecifiedID)
    }
    return responseHandler.respondWithSuccessData(res, resCode.OK, msg.dataUpdateSuccess, user)

  } catch (error: any) {
    console.error(error, "Error");
    if (error instanceof z.ZodError) {
      return responseHandler.respondWithFailed(res, resCode.BAD_REQUEST, error.errors);
    }
    return responseHandler.handleInternalError(error, next);
  }
};

const deleteUser = async (req: Request, res: Response, next: any) => {
  try {

    let control = new commonQuery(User)

    const user = await control.deleteDataById(req.params.id);
    if (!user) {
      return responseHandler.respondWithFailed(res, resCode.NOT_FOUND, msg.userNotFoundWithSpecifiedID)
    }
    return responseHandler.respondWithSuccessNoData(res, resCode.OK, msg.dataDeleteSuccess)
  } catch (error: any) {
    console.error(error, "Error");
    return responseHandler.handleInternalError(error, next);
  }
};

export const userControl = {
  createUser, getUsers, getUserById, updateUser, deleteUser
}

