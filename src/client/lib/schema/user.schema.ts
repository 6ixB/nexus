import { z } from 'zod';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 256;

const NAME_MIN_LENGTH = 1;
const NAME_MAX_LENGTH = 256;

export const BaseUserDtoSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, 'Password must be filled')
    .max(PASSWORD_MAX_LENGTH, 'Password is too long'),
  confirmPassword: z
    .string()
    .min(PASSWORD_MIN_LENGTH, 'Confirm password must be filled')
    .optional(),
  firstName: z
    .string()
    .min(NAME_MIN_LENGTH, 'First name must be filled')
    .max(NAME_MAX_LENGTH, 'First name is too long'),
  lastName: z
    .string()
    .min(NAME_MIN_LENGTH, 'Last name must be filled')
    .max(NAME_MAX_LENGTH, 'Last name is too long'),
});

export const CreateUserDtoSchema = BaseUserDtoSchema.superRefine(
  ({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== undefined && confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  },
);

export const UpdateUserDtoSchema = BaseUserDtoSchema.partial();

export const UserEntity = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH),
  lastName: z.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;
export type UserEntity = z.infer<typeof UserEntity>;
