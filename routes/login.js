let express = require('express');

let bcrypt = require('bcryptjs');

let jwt = require('jsonwebtoken')

let app = express();

let SEED = require('../config/config').SEED;

let Usuario = require('../models/usuario')


//===========================================
//Crear login  para los usuarios
//===========================================

app.post('/', (req , res)=>{

    let body = req.body;

    Usuario.findOne({email: body.email},(err, usuarioDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'ERROR AL BUSCAR USUARIOS',
                errors:err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                mensaje:'Credenciales incorrectas - email',
                errors:err
            });
        }   

        if (body.password != usuarioDB.password) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password'
            })
        }


        // CREAR UN TOKEN!!
        usuarioDB.password =":')    "
        let token = jwt.sign({ usuario : usuarioDB}, SEED,{expiresIn: 14400});

        res.status(200).json({
            ok:true,
            Usuario: usuarioDB,
            token:token,
            id:usuarioDB.id
        });

    })
    
})



module.exports=app;