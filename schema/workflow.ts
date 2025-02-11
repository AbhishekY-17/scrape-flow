import { z } from "zod";

export const createWorkflowSchema = z.object({
    name: z.string().max(50),
    description: z.string().max(50).optional(),
})

export type createWorkflowSchemaType = z.infer<typeof createWorkflowSchema>