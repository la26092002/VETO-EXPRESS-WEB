require('dotenv').config();

const express = require('express');

const authRoutes = require('./routes/auth');
const vendeurRoutes = require('./routes/vendeur');

// import swagger ui module and swagger json file

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json');


const app = express();

app.use(express.json());

// add route for swagger document API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/api/auth', authRoutes);
app.use('/api/vendeur', vendeurRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});