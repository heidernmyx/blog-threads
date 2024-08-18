import z from 'zod';

export const RegisterSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(5),
  fname: z.string(),
  lname: z.string(),
  email: z.string().email(),
  birthdate: z.string(),
  gender: z.string()
})
