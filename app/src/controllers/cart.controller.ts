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
        console.log(cartData, "cartData");

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
        let cartData: any = await control.getData({ user_id: new mongoose.Types.ObjectId(req.user.id) })
        if (!cartData) {
            return responseHandler.respondWithFailed(res, resCode.BAD_REQUEST, msg.cart.notfound);
        }
        console.log(cartData, "cartData");

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
            existingItem.product_quantity -= 1
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
        let cartData: any = await control.getData({ user_id: new mongoose.Types.ObjectId(req.user.id) })
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

const clearCart = async (req: any, res: Response, next: any) => {
    try {
        let control = new commonQuery(cartModel)
        let cartData: any = await control.deleteData({ user_id: req.user.id })
        if (!cartData) {
            return responseHandler.respondWithFailed(res, resCode.BAD_REQUEST, msg.cart.notfound);
        }
        return responseHandler.respondWithSuccessNoData(res, resCode.OK, msg.cart.deleted)
    } catch (error: any) {
        console.error(error, "Error");
        return responseHandler.handleInternalError(error, next);
    }
};

const myCart = async (req: any, res: Response, next: any) => {
    try {
        let control = new commonQuery(cartModel)
        let aggregateQuery = [
            { $match: { user_id: new mongoose.Types.ObjectId(req.user.id) } }, // Match the cart based on the user ID
            {
                $unwind: "$items" // Deconstruct the array of items in the cart
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $lookup: {
                    from: 'product_pictures',
                    localField: '_id',
                    foreignField: 'product_id',
                    as: 'images'
                }
            },
            {
                $unwind: {
                    path: "$images",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    total_price: 1,
                    "items.product_id": 1,
                    "items.product_quantity": 1,
                    "items.product_price": 1,
                    "productDetails.product_name": 1,
                    "productDetails.product_description": 1,
                    "productDetails.product_price": 1,
                    "images.image_url": 1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    user_id: { $first: "$user_id" },
                    total_price: { $first: "$total_price" },
                    items: {
                        $push: {
                            product_id: "$items.product_id",
                            product_quantity: "$items.product_quantity",
                            product_price: "$items.product_price",
                            product_name: "$productDetails.product_name",
                            product_description: "$productDetails.product_description",
                            product_price_original: "$productDetails.product_price",
                            product_image: "$images.image_url" // Include the product image URL
                        }
                    }
                }
            }
        ];



        let cartData: any = await control.lookupData(aggregateQuery)
        if (!cartData) {
            return responseHandler.respondWithFailed(res, resCode.BAD_REQUEST, msg.cart.notfound);
        }
        return responseHandler.respondWithSuccessData(res, resCode.OK, msg.cart.fetched, cartData)
    } catch (error: any) {
        console.error(error, "Error");
        return responseHandler.handleInternalError(error, next);
    }
};
export const cartController = {
    updateCart, decreaseProductQuantity, removeProductFromCart, clearCart, myCart
}

