import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    product_name: string,
    product_quantity: Number,
    product_price: Number,
    product_descriptions: string,
}

const ProductSchema: Schema = new Schema({
    product_name: { type: String, required: true },
    product_quantity: { type: Number, },
    product_price: { type: Number, required: true },
    product_description: { type: String },

});

export default mongoose.model<IProduct>('product', ProductSchema);
