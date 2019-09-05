let express = require('express');

let bcrypt = require('bcryptjs');

let jwt = require('jsonwebtoken')


let SEED = require('../config/config').SEED;

let mAutenticacion = require('../middleware/autenticacion')

let app = express();


let Usuario = require('../models/usuario')


//===========================================
//Obtener todos los usuarios
//===========================================

app.get('/', (req, res, next) =>{
    let desde = req.query.desde || 0;
    desde = Number(desde);

Usuario.find({ }, 'nombre email img role')
            .skip(desde )
            .limit(5)
            .exec(
        (err, usuarios)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'error cargando usuarios',
                errors:err
            });;
        }

        Usuario.count({},(err, conteo)=>{
            res.status(200).json({
                ok:true,
                usuarios: usuarios,
                total:conteo
            });
        })

       

    })

});



//===========================================
//Actualizar todos los usuarios
//===========================================


app.put('/:id',mAutenticacion.verificaTOken,(req, res)=>{

    let id = req.params.id;
    let body = req.body;

    Usuario.findById(id, (err, usuario)=>{
        
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'error a buscar usuario',
                errors:err
            });
        }

        if(!usuario){
            return res.status(400).json({
                ok:false,
                mensaje:'el usuario con el id' + id + ' no existe',
                errors: {message:'no existe un usuario con este id'}
            });
        }

        usuario.nombre = body.nombre;
        usuario.email=body.email;
        usuario.role = body.role;   

        usuario.save( (err, usuarioGuardado)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:'error al actualizar usuario',
                    errors:err
                });
            }
            usuarioGuardado.password = ":')"

            res.status(200).json({
                ok:true,
                usuario: usuarioGuardado
            });


        })

    });

});


//===========================================
//Crear nuevo usuario
//===========================================

app.post('/', mAutenticacion.verificaTOken,(req, res) =>{

     let body = req.body; 

     usuario = new Usuario({
         nombre: body.nombre,
         email: body.email,
         password: bcrypt.hashSync( body.password, 10),
         img: body.img,
         role: body.role
     });

     usuario.save((err, usuarioGuardado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:'error al crear usuario',
                errors:err
            });;
        }

        res.status(201).json({
            ok:true,
            usuario: usuarioGuardado,
            usuariotoken : req.usuario
        });
     });

     
})




//===========================================
//Borrar un usuario
//===========================================

app.delete('/:id',mAutenticacion.verificaTOken ,(req, res)=>{
    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'error al borrar usuario',
                errors:err
            });;
        }


        if(!usuarioBorrado){
            return res.status(400).json({
                ok:false,
                mensaje:'No existe el usuario con ese id',
                errors:{message:'No existe el usuario con ese id'}
            });;
        }

        res.status(200).json({
            ok:true,
            usuario: usuarioBorrado
        });

    });
});


module.exports = app;