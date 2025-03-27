import { z } from "zod";


export const sendEmailSchema = z.object({
    email: z.string().min(0)
})

export const getTimeSchema = z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date()
})