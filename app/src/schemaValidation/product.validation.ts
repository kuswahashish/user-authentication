import { z } from 'zod';

const createSchema = z.object({
    product_name: z.string().min(1, 'Product name is required'),
    product_quantity: z.string().min(1, 'Product quantity is required'),
    product_price: z.string().min(1, 'Product price is required'),
    product_description: z.string().min(1, 'Product description is required'),
});

const updateSchema = z.object({
    product_name: z.string().min(1, 'Product name is required').optional(),
    last_name: z.string().min(1, 'Product name is required').optional(),
    product_price: z.string().min(1, 'Product price is required').optional(),
    product_description: z.string().min(1, 'Product description is required').optional(),
});



export const productSchemaValidation = {
    createSchema, updateSchema,
}
