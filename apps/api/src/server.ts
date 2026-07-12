import { createServer } from "./server/create-server.js";
import { apiEnv } from "./config/env.js";

const app = createServer();

app.listen(apiEnv.port, () => {
  console.log(`GrowEasy API listening on port ${apiEnv.port}`);
});
