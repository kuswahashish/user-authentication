import { z } from 'zod';

const changePasswordSchema = z.object({
  old_password: z.string(),
  new_password: z.string(),
  new_conf_password: z.string()
});

const resetPasswordSchema = z.object({
  new_password: z.string(),
  new_conf_password: z.string()
});

export const userAuthValidation = {
  changePasswordSchema,
  resetPasswordSchema,
}