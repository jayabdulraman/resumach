import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  email_confirmed_at: z.string(),
  created_at: z.date().or(z.string()),
  updated_at: z.date().or(z.string()),
});

export class UserDto extends createZodDto(userSchema) {}


