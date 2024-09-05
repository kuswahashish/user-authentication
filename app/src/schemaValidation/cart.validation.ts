import { z } from 'zod';

// Zod schema for CartItem
const cartItemSchema = z.object({
    product_id: z.string().nonempty({ message: "Product ID is required" }),
    product_quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
    product_price: z.number().min(0, { message: "Price must be a positive number" }),
});

// Zod schema for Cart
const cartSchema = z.object({
    user_id: z.string().nonempty({ message: "User ID is required" }),
    items: z.array(cartItemSchema).nonempty({ message: "Items array cannot be empty" }),
    total_price: z.number().min(0, { message: "Total price must be a positive number" }).optional(), // total_price is optional since it's calculated
});

// TypeScript types inferred from Zod schemas
type CartItemType = z.infer<typeof cartItemSchema>;
type CartType = z.infer<typeof cartSchema>;

export { cartItemSchema, cartSchema, CartItemType, CartType };
