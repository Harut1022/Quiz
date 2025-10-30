import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ներմուծում ենք swagger-ի YAML ֆայլը
const swaggerDocument = YAML.load(path.join(__dirname, "../docs/api.yaml"));

export const setupSwagger = (app) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("📘 Swagger Docs available at /docs");
};