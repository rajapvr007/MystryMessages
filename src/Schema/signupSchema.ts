import { z } from "zod";

const usernameValidation = z
  .string()
  .min(4, "Username must be atlease 4 characters!")
  .max(20, "Username must not be greater than 20 character!")
  .regex(/^[a-zA-Z0-9._-]$/, " Username must contain special characters!");

export const singUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
});
