let express = require('express');

let bcrypt = require('bcryptjs')

let jwt = require('jsonwebtoken')

let app = express();

let SEED = require('../config/config').SEED;

let Usuario = require('../models/usuario');



// google

let CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return{
        nombre:payload.name,
        email : payload.email,
        img:payload.picture,
        google: true,
        payload
    }

  }


//===========================================
// Login google
//===========================================


app.post('/google', async(req,res)=>{

    let token = req.body.token;

    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            mensaje: 'Token no valido',
            errors:e
        });
    });


    Usuario.findOne({email :googleUser.email }, (err,usuarioDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'ERROR AL BUSCAR USUARIOS',
                errors:err
            });
        }


        if(usuarioDB){
            
            if (usuarioDB.google === false){
                return res.status(400).json({
                    ok:false,
                    mensaje:'su correo ya esta en uso'
            });
        } else {
            let token = jwt.sign({ usuario : usuarioDB}, SEED,{expiresIn: 14400});

         res.status(200).json({
            ok:true,
            Usuario: usuarioDB,
            token:token,
            id:usuarioDB._id
        });

        }
    } else {
        // crear usuario cuando no existe

        let usuario = new Usuario();

        usuario.nombre =googleUser.nombre;
        usuario.email =googleUser.email;
        usuario.img =googleUser.img;
        usuario.google =googleUser.true;
        usuario.password =':)'

        usuario.save((err, usuarioDB)=>{
            let token = jwt.sign({ usuario : usuarioDB}, SEED,{expiresIn: 14400});

            res.status(200).json({
               ok:true,
               Usuario: usuarioDB,
               token:token,
               id:usuarioDB._id
           });
        })



    }

    })



// res.status(200).json({
//     ok: true,
//     mensaje: 'OK!!!',
//     googleUser: googleUser
// });
    
})

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

        // if (body.password != usuarioDB.password) {
        //     return res.status(400).json({
        //         ok: false,
        //         mensaje: 'Credenciales incorrectas - password'
        //     })
        // }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password'
            })
        }
 

        //CREAR UN TOKEN!!
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