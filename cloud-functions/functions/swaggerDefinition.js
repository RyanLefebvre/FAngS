// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FAngS Cloud Function API',
      version: '1.0.0',
      description: 'Documentation for the FAngs Cloud Function API',
    },
    tags: [
      {
        name: 'Hey!',
        externalDocs: {
          description: "Paste this JSON in this link if you haven't already",
          url: 'https://editor.swagger.io/',
        },
      },
    ],
  },
  apis: ['./src/services/user.ts'],
};

const openapiSpecification = swaggerJsdoc(options);

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

storeData(openapiSpecification, './swagger.json');
