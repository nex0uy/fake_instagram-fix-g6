const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Instagram Clone API",
      version: "1.0.0",
      description:
        "API de un Instagram básico con autenticación, publicación de fotos y edición de perfiles.",
    },
    servers: [
      {
        url: "http://localhost:3001", // URL base de la API
      },
    ],
  },
  apis: ["./routes/*.js"], // Rutas donde se documentarán los endpoints
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
