import { z } from 'zod';

const baseResumeItemSchema = z.object({
  company: z.string().min(1, 'Company is required').max(255),
  position: z.string().min(1, 'Position is required').max(255),
  description: z.string().min(1, 'Description is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  displayOrder: z.number().int().default(0),
});

export const ResumeItemCreateSchema = baseResumeItemSchema.refine(
  (data) => {
    if (data.endDate && data.startDate) {
      return data.endDate >= data.startDate;
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

export const ResumeItemUpdateSchema = baseResumeItemSchema.partial().refine(
  (data) => {
    if (data.endDate && data.startDate) {
      return data.endDate >= data.startDate;
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

export type ResumeItemCreateInput = z.infer<typeof ResumeItemCreateSchema>;
export type ResumeItemUpdateInput = z.infer<typeof ResumeItemUpdateSchema>;
