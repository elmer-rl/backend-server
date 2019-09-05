let express = require('express');

let app = express();

let fileUpload = require('express-fileupload');

let fs = require('fs')

let Usuario = require('../models/usuario')

let Medico = require('../models/medico')

let Hospital = require('../models/hospital')


// DEFAULT OPTIONS
app.use(fileUpload());




// RUTAS

app.put('/:tipo/:id', (req, res, next) =>{
    
    let tipo = req.params.tipo;
    let id = req.params.id; 

    // tipos de coleccion
    let tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,
            mensaje:'archino no seleccionado',
            errors: {message: 'debe seleccionar una imagen'}
        });
    }

    if(!req.files){
        return res.status(400).json({
            ok:false,
            mensaje:'tipo de coleccion no valida',
            errors: {message: 'tipo de coleccion no valido'}
        });
    }

    // obtener nombre dle archivo

    let archivo = req.files.imagen;
    let nombreCortado = archivo.name.split('.')
    let extensionArchivo = nombreCortado[nombreCortado.length -1 ]

// solo aceptamos estas extensiones 

    let extensionesValidas = ['png','jpg','gift','jpeg']
    if(extensionesValidas.indexOf(extensionArchivo)<0){
        return res.status(400).json({
            ok:false,
            mensaje:'extension no valida',
            errors: {message: 'las extensiones validas son  ' + extensionesValidas.join(', ')}
        });
    }


    // NOmbre de archivo personalizado

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo del temporal a un path especifico

    let path =  `./uploads/${ tipo }/${nombreArchivo}`;

    archivo.mv( path, err=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al mover archivo',
                errors: err
            });
        }
        
        subirPorTIpo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok:true,
        //     mensaje:'Archivo movido',
        //     extensionArchivo:extensionArchivo
        // });

    });

})


function subirPorTIpo(tipo, id, nombreArchivo, res){


  
    if(tipo ==='usuarios'){

        Usuario.findById(id, (err, usuario)=>{

            if(!usuario){

            return res.status(400).json({
                ok:false,
                mensaje:'Usuario no exisye',
                erros: 'Usuario no existe'
            });
    
            }

            let pathViejo = './uploads/usuarios/' + usuario.img;

            // si existe elimina la imagen anterior 

            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;
            
            usuario.save((err, usuarioActualizado)=>{
            
            usuarioActualizado.password = '**********'

            return res.status(200).json({
            ok:true,
            mensaje:'Imagen actualizado',
            usuario: usuarioActualizado
        });


            });
            

        })
        
    }

    if(tipo ==='medicos'){

        Medico.findById(id, (err, medico)=>{

            if(!medico){

                return res.status(400).json({
                    ok:false,
                    mensaje:'medico no exisye',
                    erros: 'medico no existe'
                });
        
                }

            let pathViejo = './uploads/medicos/' + medico.img;

            // si existe elimina la imagen anterior 

            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }

            medico.img = nombreArchivo;
            
            medico.save((err, medicoActualizado)=>{


            return res.status(200).json({
            ok:true,
            mensaje:'Imagen actualizado',
            medico: medicoActualizado
        });


            });
            

        })
        
    }

    if(tipo ==='hospitales'){

        Hospital.findById(id, (err, hospital)=>{

            if(!hospital){

                return res.status(400).json({
                    ok:false,
                    mensaje:'hospital no exisye',
                    erros: 'hospital no existe'
                });
        
                }

            let pathViejo = './uploads/hospitales/' + hospital.img;

            // si existe elimina la imagen anterior 

            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }

            hospital.img = nombreArchivo;
            
            hospital.save((err, hospitalActualizado)=>{

            return res.status(200).json({
            ok:true,
            mensaje:'Imagen actualizado',
            hospital: hospitalActualizado
        });


            });
            

        })
        
    }

}

module.exports = app; 