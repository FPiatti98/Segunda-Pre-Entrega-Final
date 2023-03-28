import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './util.js';
import session from 'express-session';
//server
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
//Routers
import productsRouter from '../src/dao/fylesystem/routes/productsRoutes.js'
import cartsRouter from '../src/dao/fylesystem/routes/cartRoutes.js';
import productsRouterMongo from '../src/dao/mongodb/routes/products.route.js'
import cartsRouterMongo from '../src/dao/mongodb/routes/carts.route.js'
import viewsRouter from './routes/viewsRoutes.js';
import UserViewsRouter from './routes/user.views.routes.js'
import sessionsRouter from './routes/session.routes.js'

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

//Session
const MONGO_URL = 'mongodb+srv://Fpiatti98:1diDusUmSWY0I7wI@cluster0.l1iwkg3.mongodb.net/ecommerce'

app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 30
    }),
    secret: "coderS3cr3t",
    resave: false,
    saveUninitialized: true
}))

//Routes
app.use('/filesys', productsRouter);
app.use('/filesys', cartsRouter);
app.use('/mongodb/api/', productsRouterMongo);
app.use('/mongodb/api/', cartsRouterMongo);
app.use('/', viewsRouter);
app.use("/users", UserViewsRouter);
app.use("/api/sessions", sessionsRouter)


//Server / MongoDB
const SERVER_PORT = 8080
const httpServer = app.listen(SERVER_PORT, () => {console.log(`Escuchando desde el puerto ${SERVER_PORT}`);});

const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Conectado con exito a MongoDB usando Moongose.");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
};
connectMongoDB();