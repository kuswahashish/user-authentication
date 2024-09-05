import mongoose, { Document, Schema } from 'mongoose';

// Interface for CartItem subdocument
export interface ICartItem extends Document {
    product_id: mongoose.Types.ObjectId;
    product_quantity: number;
    product_price: number;
}

// Interface for Cart document
export interface ICart extends Document {
    user_id: mongoose.Types.ObjectId;
    items: ICartItem[];
    total_price: number;

}

// Schema for CartItem
const CartItemSchema: Schema = new Schema({
    product_id: { type: mongoose.Types.ObjectId, ref: 'product', required: true },
    product_quantity: { type: Number, required: true, default: 1 },
    product_price: { type: Number, required: true }
});

// Schema for Cart
const CartSchema: Schema = new Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    items: [CartItemSchema],
    total_price: { type: Number, required: true, default: 0 },
});


// Calculate the total product_price before saving
CartSchema.pre<ICart>('save', function (next) {
    this.total_price = this.items.reduce((acc: number, item: ICartItem) => {
        return acc + (item.product_price * item.product_quantity);
    }, 0);
    next();
});

export default mongoose.model<ICart>('cart', CartSchema);
