import { createRequestClient } from "./request";
import { apis, APISchemas } from "./schema";

const http = createRequestClient<APISchemas>({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_PATH,
  apis,
});

export default http;
