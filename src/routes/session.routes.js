import { Router } from "express";
import { userModel } from "../dao/mongodb/models/user.model.js";
import { createHash, isValidPassword } from "../util.js";

const router = Router();

router.post("/register", async(req, res) => {
    const {first_name, last_name, email, age, password} = req.body;
    let rol = ""
    console.log("Registrando usuario");

    const exist = await userModel.findOne({email});

    if(exist){
        return res.status(400).send({status: "error", message: `El usuario con el email ${email} ya existe`})
    };

    //agregar role y si el email es "ejemplo@gmail.com" ponerle admin, sino ponerle user

    if(email === 'adminCoder@coder.com'){
        rol = "admin"
    } else {
        rol = "user"
    }

    const user = {
        first_name,
        last_name,
        email,
        age,
        role: rol,
        password : createHash(password)
    };

    console.log(user)

    const result = await userModel.create(user);
    res.status(200).send({status: "success", message: "Usuario creado con extito con ID: " + result.id});
});

router.post("/login", async(req, res) => {
    const {email, password} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(401).send({status:"error", message: "Credenciales incorrectas"})
    }
    if(!isValidPassword(user, password)){
        return res.status(401).send({status:"error", error: "password incorrecta"})
    }
    
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }
    res.status(200).send({status:"success", payload:req.session.user, message:"Usuario logueado con exito" });
});

router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error){
            res.json({error: "error logout", mensaje: "Error al cerrar la sesion"});
        }
        res.status(200).send("Sesion cerrada correctamente.");
    });
});

export default router