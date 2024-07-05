import { z } from 'zod';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 256;

export const AuthSignInDtoSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, 'Password must be filled')
    .max(PASSWORD_MAX_LENGTH, 'Password is too long'),
});

export type AuthSignInDto = z.infer<typeof AuthSignInDtoSchema>;
