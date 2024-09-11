import { Request, Response } from 'express';
import { userSchemaValidation } from '../schemaValidation/user.Validation';
import { z } from 'zod';
import { responseHandler } from '../services/responseHandler.service';
import { resCode } from '../../constants/res.code';
import { msg } from '../../constants/en';
import commonQuery from '../services/commanQuery.service';
import productModel from '../models/product.model';
import productPictureModel from '../models/productPicture.model';
import { productSchemaValidation } from '../schemaValidation/product.validation';
import mongoose from 'mongoose';

const createProduct = async (req: Request, res: Response, next: any) => {
    try {

        let parsedBody = productSchemaValidation.createSchema.parse(req.body);
        console.log(parsedBody, "parsedbody");
        let control = new commonQuery(productModel)
        let productData = await control.create(parsedBody)
        const productFiles: any = [];
        const files = req.files as Express.Multer.File[];
        if (files) {
            files.forEach((file: Express.Multer.File) => {
                productFiles.push({ product_id: productData._id, product_picture: file.path });
            });
        }
        let poductPictureControl = new commonQuery(productPictureModel)
        await poductPictureControl.create(productFiles)
        return responseHandler.respondWithSuccessData(res, resCode.CREATED, msg.product.created, productData)
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

const getProducts = async (req: Request, res: Response, next: any) => {
    try {
        let control = new commonQuery(productModel)
        let aggregateQuery = [
            {
                $lookup: {
                    from: 'product_pictures',
                    localField: '_id',
                    foreignField: 'product_id',
                    as: 'images'
                }
            }
        ]
        const productDetails = await control.lookupData(aggregateQuery)
        return responseHandler.respondWithSuccessData(res, resCode.OK, msg.product.fetched, productDetails)
    } catch (error: any) {
        console.error(error, "Error");
        return responseHandler.handleInternalError(error, next);
    }
};

const getProductById = async (req: Request, res: Response, next: any) => {
    try {
        let control = new commonQuery(productModel)
        let aggregateQuery = [
            { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
            {
                $lookup: {
                    from: 'product_pictures',
                    localField: '_id',
                    foreignField: 'product_id',
                    as: 'images'
                }
            }

        ]
        const productDetails = await control.lookupData(aggregateQuery)
        if (!productDetails) {
            return responseHandler.respondWithFailed(res, resCode.NOT_FOUND, msg.product.notfound)
        }
        return responseHandler.respondWithSuccessData(res, resCode.OK, msg.product.fetched, productDetails)
    } catch (error: any) {
        console.error(error, "Error");
        return responseHandler.handleInternalError(error, next);
    }
};

const updateProduct = async (req: Request, res: Response, next: any) => {
    try {
        const parsedBody = productSchemaValidation.updateSchema.parse(req.body);
        let control = new commonQuery(productModel)
        if (parsedBody.remove_product_picture && parsedBody.remove_product_picture.length > 0)
            await control.deleteData({ _id: parsedBody.remove_product_picture })
        const product = await control.updateData(req.params.id, parsedBody)
        if (!product) {
            return responseHandler.respondWithFailed(res, resCode.NOT_FOUND, msg.product.notfound)
        }
        return responseHandler.respondWithSuccessData(res, resCode.OK, msg.product.updated, product)

    } catch (error: any) {
        console.error(error, "Error");
        if (error instanceof z.ZodError) {
            return responseHandler.respondWithFailed(res, resCode.BAD_REQUEST, error.errors);
        }
        return responseHandler.handleInternalError(error, next);
    }
};

const deleteProduct = async (req: Request, res: Response, next: any) => {
    try {

        let control = new commonQuery(productModel)

        const product = await control.deleteDataById(req.params.id);
        if (!product) {
            return responseHandler.respondWithFailed(res, resCode.NOT_FOUND, msg.product.notfound)
        }
        return responseHandler.respondWithSuccessNoData(res, resCode.OK, msg.product.deleted)
    } catch (error: any) {
        console.error(error, "Error");
        return responseHandler.handleInternalError(error, next);
    }
};

export const productController = {
    createProduct, getProducts, getProductById, updateProduct, deleteProduct
}

