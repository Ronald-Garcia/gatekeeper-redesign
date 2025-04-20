import { z } from "zod";


export const sendEmailSchema = z.object({
    email: z.string().min(0),
    user: z.string()
})

export const getTimeSchema = z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date()
})

export const getDateSchema = z.object({
    date: z.coerce.date(),
})