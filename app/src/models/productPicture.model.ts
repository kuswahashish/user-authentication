import mongoose, { Document, Schema } from 'mongoose';

export interface IProductPicture extends Document {
    product_id: mongoose.Types.ObjectId;
    product_picture: string;
}

const ProductPictureSchema: Schema = new Schema({
    product_id: { type: mongoose.Types.ObjectId, required: true, ref: "Product" },
    product_picture: { type: String, required: true },
});

export default mongoose.model<IProductPicture>('product_picture', ProductPictureSchema);
