import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import __dirname from './util.js';
import productsRouter from '../src/dao/fylesystem/routes/productsRoutes.js'
import cartsRouter from '../src/dao/fylesystem/routes/cartRoutes.js';
import productsRouterMongo from '../src/dao/mongodb/routes/products.route.js'
import cartsRouterMongo from '../src/dao/mongodb/routes/carts.route.js'
import viewsRouter from './views/routes/viewsRoutes.js';

const app = express();
//Express
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Public
app.use(express.static(__dirname+'/public'));

//Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine','handlebars');

//Routes
app.use('/filesys', productsRouter);
app.use('/filesys', cartsRouter);
app.use('/mongodb/api/', productsRouterMongo);
app.use('/mongodb/api/', cartsRouterMongo);
app.use('/', viewsRouter);

//Server / MongoDB
const SERVER_PORT = 8080
const httpServer = app.listen(SERVER_PORT, () => {console.log(`Escuchando desde el puerto ${SERVER_PORT}`);});

const connectMongoDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://Fpiatti98:1diDusUmSWY0I7wI@cluster0.l1iwkg3.mongodb.net/ecommerce');
        console.log("Conectado con exito a MongoDB usando Moongose.");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
};
connectMongoDB();