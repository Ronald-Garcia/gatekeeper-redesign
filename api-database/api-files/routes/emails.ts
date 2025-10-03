import { Hono } from "hono";
import { Context } from "../lib/context.js";
import { zValidator } from "@hono/zod-validator";
import { getDateSchema, getTimeSchema, sendEmailSchema } from "../validators/emailSchemas.js";
import { db } from "../db/index.js";
import { budgetCodes, financialStatementsTable, machines, users } from "../db/schema.js";
import nodemailer from "nodemailer"
import writeXlsxFile from "write-excel-file/node";
import { and, between, eq } from "drizzle-orm";
import { adminGuard } from "../middleware/adminGuard.js";
import { HTTPException } from "hono/http-exception";
import Bree from "bree"; 
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import schedule from "node-schedule";


let j: schedule.Job;
/**
 * Routes for email operations.
 * @post    /statement-email/:email    sends financial statements via email for a date range.
 */
export const emailRoutes = new Hono<Context>();

type StatementType = {
  user: {
    JHED: string
  },
  budgetCode: {
    name: string,
    code: string
  },
  machine: {
    name: string,
    hourlyRate: number
  },
  dateAdded: Date,
  timeSpent: number
}

function getValidDate(year: number, month: number, day: number): Date {
  // Get the last day of the month: new Date(year, month + 1, 0) returns the last day.
  const lastDay = new Date(year, month + 1, 0).getDate();
  const validDay = Math.min(day, lastDay);
  return new Date(year, month, validDay);
}


async function sendEmail(email: string, scheduled: boolean, user: string, startDate?:Date, endDate?:Date, date?:Date, ) : Promise<StatementType[]> {

   if(scheduled) {

    if (!date) {
      throw new HTTPException(500, { message: "Dates undefined" });
     }

    const day = date.getDate();
    const now = new Date();
    // Compute startDate as the same day in the previous month and endDate as the same day in the current month.
    startDate = getValidDate(now.getFullYear(), now.getMonth() - 1, day);
    endDate = getValidDate(now.getFullYear(), now.getMonth(), day);
   }  


  
   if (!startDate || ! endDate) {
    throw new HTTPException(500, { message: "Dates undefined" });
   }


   const allMachines = await db.select().from(machines);

//   const data = await new Promise(async (resolve, reject) => {
//     const results = await allMachines.map(async (mach) => {
//       // query the financial statements table for the specified date range with the user, budget code, and machine information
//       const statements = await db.select({
//         user: {
//           JHED: users.JHED
//         },
//         budgetCode: {
//           name: budgetCodes.name,
//           code: budgetCodes.code
//         },
//         machine: {
//           name: machines.name,
//           hourlyRate: machines.hourlyRate
//         },
//         dateAdded: financialStatementsTable.dateAdded,
//         timeSpent: financialStatementsTable.timeSpent
//       }).from(financialStatementsTable)
//                                       .innerJoin(users, eq(users.id, financialStatementsTable.userId))
//                                       .innerJoin(budgetCodes, eq(budgetCodes.id, financialStatementsTable.budgetCode))
//                                       .innerJoin(machines, eq(machines.id, financialStatementsTable.machineId))
//                                       .where(eq(financialStatementsTable.machineId, mach.id))
//       return statements;
//   })

//   resolve(results);

// });



    const statements = await db.select({
        user: {
          JHED: users.JHED
        },
        budgetCode: {
          name: budgetCodes.name,
          code: budgetCodes.code
        },
        machine: {
          name: machines.name,
          hourlyRate: machines.hourlyRate
        },
        dateAdded: financialStatementsTable.dateAdded,
        timeSpent: financialStatementsTable.timeSpent
      }).from(financialStatementsTable)
                                      .innerJoin(users, eq(users.id, financialStatementsTable.userId))
                                      .innerJoin(budgetCodes, eq(budgetCodes.id, financialStatementsTable.budgetCode))
                                      .innerJoin(machines, eq(machines.id, financialStatementsTable.machineId))
  // const sheets = allMachines.map(m => m.name)

      const excelSchema = [
        {
          column: "Machine",
          type: String,
          value: (s: StatementType) => s.machine.name
        },
        {
          column: "Charge",
          type: Number,
          value: (s: StatementType) => Math.round(s.timeSpent/60 / 15) * s.machine.hourlyRate/4
        },
        {
          column: "Receiver Type",
          type: String,
          value: (s: StatementType) => s.budgetCode.code.length === 10 ? "CC" : "IO"
        },
        {
          column: "Budget",
          type: String,
          value: (s: StatementType) => s.budgetCode.code
        },
        {
          column: "Text",
          type: String,
          value: (s: StatementType) => [s.user.JHED, s.budgetCode.name, s.dateAdded.toLocaleString()].join(", ")
        },
        {
          column: "Date",
          type: String,
          value: (s: StatementType) => s.dateAdded.toLocaleString()
        }

      ]

      // const test = await data.map(async d => await d);

      
      // console.log(test);
      const file = await writeXlsxFile(statements, {
        schema: excelSchema,
        buffer: true
      })

    
      
  const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
      }
    });

await new Promise((resolve, reject) => {
      // send the email with the financial statements
      transporter.sendMail({
          to: email,
          subject: "Financial Statements",
          html: `<h1>Financial Statements</h1>\n<p>Financial Statements from <b>${startDate.toDateString()} to ${endDate.toDateString()}</b> were requested by <b>${user}</b></p>` ,
          attachments: [{
            filename: "financialStatement.xlsx",
            content: file
          }]
      }, (err, info) => {
        if (err) {
          console.error(err);
        } else {
          console.log(info);
          resolve(info);
        }
      })});


      return statements;


    }




/**
 * Sends financial statements via email for a specified date range.
 * @param email        the email address to send statements to
 * @body startDate     the start date for the statements
 * @body endDate       the end date for the statements
 * @returns the financial statements data and email send status
 */
emailRoutes.post("/statement-email/:email", 
    zValidator("json", getTimeSchema),
    zValidator("param", sendEmailSchema),
    adminGuard,
    async (c) => {

      let success = true;
      let message = "Successfully sent an email";

      const { email } = c.req.valid("param");
      const { startDate, endDate } = c.req.valid("json");
      const  user = c.get("user") 
      const [{ username }] = await db
        .select({ username: users.name })
        .from(users)
        .where(eq(users.id, user!.id))     
      
      const statements = await sendEmail(email, false , username, startDate, endDate)
      .then(() => {
        success = true;
        message = "Successfully sent an email";
      }).catch((err) => {
        console.log(err);
        success = false;
        message = "Failed to send an email";
      })
    
      return c.json({
        success: success,
        data: statements,
        message: message
    });
});


emailRoutes.post("/statement-email/schedule/:email",
  zValidator("json", getDateSchema),
  zValidator("param", sendEmailSchema),
  adminGuard,
  async (c) => {
    const { email } = c.req.valid("param");
    const { date } = c.req.valid("json");
    const  user = c.get("user") 
    const [{ username }] = await db
      .select({ username: users.name })
      .from(users)
      .where(eq(users.id, user!.id)) 
    //Create a Bree instance, might need to do singleton instancem for prod

    try {
      
      if (!j) {
        j = schedule.scheduleJob(`0 0 ${date.getDay()} * *`, async () => {
          await sendEmail(email, true, username, undefined, undefined, date);
        });  
      } else {
        j.reschedule(`0 0 ${date.getDay()} * *`);
      }
 

    } catch (err) {
      console.error(err);
      throw new HTTPException(500, { message: "Failed to schedule email automation." });
    }

    return c.json({
      success: true,
      message: `Automated email scheduled to run on day ${date} of every month at midnight.`
    });
});

emailRoutes.delete("/statement-email/cancel",

  async (c) => {
    j.cancel();
    return c.json({
      success: true,
      message: "Automated email cancelled."
    });
  }
)

