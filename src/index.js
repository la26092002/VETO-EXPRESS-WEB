require('dotenv').config();

const express = require('express');

const authRoutes = require('./routes/auth');
const vendeurRoutes = require('./routes/vendeur');
const clientRoutes = require('./routes/client');
const docteurRoutes = require('./routes/docteur');
const adminRoutes = require('./routes/admin');
const livreurRoutes = require('./routes/livreur');
const extraRoutes = require('./routes/extraRoute');


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
app.use('/api/client', clientRoutes);
app.use('/api/docteur', docteurRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/livreur', livreurRoutes);
app.use('/api/extraRoute', extraRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});