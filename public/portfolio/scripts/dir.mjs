import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url),
    __dirname = path.dirname(__filename),
    topDir = `${__dirname}/../c2c`;

export { topDir };
