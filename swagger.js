export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Access For Justice API",
    version: "1.0.0"
  },
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": { description: "OK" }
        }
      }
    }
  }
};
