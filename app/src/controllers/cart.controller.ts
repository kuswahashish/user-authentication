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
import cartModel from '../models/cart.model';
import { cartItemSchema } from '../schemaValidation/cart.validation';
import { log } from 'console';

const updateCart = async (req: any, res: Response, next: any) => {
    try {
        const productData = cartItemSchema.parse(req.body);
        let control = new commonQuery(cartModel)
        let cartData: any = await control.getData({ user_id: req.user.id })
        if (!cartData) {
            cartData = await control.create({ user_id: req.user.id, items: [productData] })
        } else {
            const existingItem = cartData.items.find((item: any) => {
                console.log(item.product_id, productData.product_id, item.product_id == productData.product_id);

                if (item.product_id == productData.product_id)
                    return item
            })
            console.log(existingItem, "aseae");

            if (existingItem) {
                existingItem.product_quantity += productData.product_quantity;
            } else {
                cartData.items.push(productData);
            }
        }
        await cartData.save()

        return responseHandler.respondWithSuccessData(res, resCode.CREATED, msg.product.created, productData)
    } catch (error: any) {
        console.error(error, "Error");
        if (error instanceof z.ZodError) {
            return responseHandler.respondWithFailed(res, resCode.BAD_REQUEST, error.errors);
        }
        return responseHandler.handleInternalError(error, next);
    }
};

const decreaseProductQuantity = async (req: any, res: Response, next: any) => {
    try {
        let control = new commonQuery(cartModel)
        let cartData: any = await control.getData({ user_id: req.user.id })
        if (!cartData) {
            return responseHandler.respondWithFailed(res, resCode.BAD_REQUEST, msg.cart.notfound);
        }
        const existingItem = cartData.items.find((item: any) => {
            console.log(item.product_id, req.params.id, item.product_id == req.params.id);

            if (item.product_id == req.params.id)
                return item
        })
        if (!existingItem)
            return responseHandler.respondWithFailed(res, resCode.BAD_REQUEST, msg.cart.itemNotFound);
        if (existingItem.product_quantity == 1) {
            await control.findAndUpdateOperation({ user_id: req.user.id }, { $pull: { items: { product_id: req.params.id } } })
        } else {
            existingItem.product_quantity += 1
        }

        await cartData.save()

        return responseHandler.respondWithSuccessData(res, resCode.OK, msg.product.updated, cartData)
    } catch (error: any) {
        console.error(error, "Error");
        return responseHandler.handleInternalError(error, next);
    }
};

const removeProductFromCart = async (req: any, res: Response, next: any) => {
    try {
        let control = new commonQuery(cartModel)
        let cartData: any = await control.getData({ user_id: req.user.id })
        if (!cartData) {
            return responseHandler.respondWithFailed(res, resCode.BAD_REQUEST, msg.cart.notfound);
        }
        await control.findAndUpdateOperation({ user_id: req.user.id }, { $pull: { items: { product_id: req.params.id } } })
        return responseHandler.respondWithSuccessData(res, resCode.OK, msg.product.updated, cartData)
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

export const cartController = {
    updateCart, decreaseProductQuantity, removeProductFromCart, getProductById, updateProduct, deleteProduct
}

