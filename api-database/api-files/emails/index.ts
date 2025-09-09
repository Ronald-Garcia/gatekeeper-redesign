import Bree from "bree";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const bree = new Bree({
    root: join(__dirname, "../emails/jobs")
});