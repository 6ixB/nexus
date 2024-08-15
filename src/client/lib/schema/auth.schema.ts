import { z } from 'zod';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 256;

export const AuthSignInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, 'Password must be filled')
    .max(PASSWORD_MAX_LENGTH, 'Password is too long'),
});

export const LoginSchema = z
  .object({
    accountId: z.string(),
    acr: z.string().optional(),
    amr: z.array(z.string()).optional(),
    remember: z.boolean().optional(),
    ts: z.number().optional(),
  })
  .catchall(z.unknown());

export const ConsentSchema = z
  .object({
    graintId: z.string().optional(),
  })
  .catchall(z.unknown());

export const AuthInteractionDtoSchema = z.object({
  login: LoginSchema.optional(),
  consent: ConsentSchema.optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});

export const SessionSchema = z.object({
  accountId: z.string(),
  uid: z.string(),
  cookies: z.string(),
  acr: z.string().optional(),
  amr: z.array(z.string()).optional(),
});

export const UnknownObjectSchema = z.record(z.unknown());

export const PromptDetailSchema = z.object({
  name: z.union([z.literal('login'), z.literal('consent'), z.string()]),
  reasons: z.array(z.string()),
  details: UnknownObjectSchema,
});

export const InteractionResultsSchema = z
  .object({
    login: LoginSchema.optional(),
    consent: ConsentSchema.optional(),
  })
  .catchall(z.unknown());

export const InteractionSchema = z.object({
  jti: z.string(),
  kind: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional(),
  session: SessionSchema.optional(),
  params: UnknownObjectSchema,
  prompt: PromptDetailSchema,
  result: InteractionResultsSchema.optional(),
  returnTo: z.string(),
  deviceCode: z.string().optional(),
  trusted: z.array(z.string()).optional(),
  uid: z.string(),
  lastSubmission: InteractionResultsSchema.optional(),
  grantId: z.string().optional(),
  cid: z.string(),
});

export type AuthSignIn = z.infer<typeof AuthSignInSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type Consent = z.infer<typeof ConsentSchema>;
export type AuthInteraction = z.infer<typeof AuthInteractionDtoSchema>;

export type Session = z.infer<typeof SessionSchema>;
export type UnknownObject = z.infer<typeof UnknownObjectSchema>;
export type PromptDetail = z.infer<typeof PromptDetailSchema>;
export type InteractionResults = z.infer<typeof InteractionResultsSchema>;
export type Interaction = z.infer<typeof InteractionSchema>;
