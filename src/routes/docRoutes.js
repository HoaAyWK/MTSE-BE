const { Router } = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('../docs/swaggerDef');

const router = Router();

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ['src/docs/*.yml', 'src/routes/*.js', 'src/routes/routers/*.js'],
});

router.use('/', 
    swaggerUi.serve, 
    swaggerUi.setup(specs, {
        explorer: true,
    })
);


module.exports = router;