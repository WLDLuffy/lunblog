import { z } from 'zod';

export const BlogPostCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase and URL-safe'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500).optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const BlogPostUpdateSchema = BlogPostCreateSchema.partial();

export type BlogPostCreateInput = z.infer<typeof BlogPostCreateSchema>;
export type BlogPostUpdateInput = z.infer<typeof BlogPostUpdateSchema>;
