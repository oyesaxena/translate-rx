import { z } from 'zod';

export const translateRequest = z.object({
  languages: z.array(z.string()),
  strings: z.array(z.string()),
});
export const transliterateRequest = z.object({
  languages: z.array(z.string()),
  name: z.string(),
});

export type TranslateRequest = z.infer<typeof translateRequest>;

export enum ApiType {
  FREE = 'FREE',
  PAID = 'PAID',
}
