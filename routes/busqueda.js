let express = require('express');

let app = express();

let Hospital = require('../models/hospital')

let Medico = require('../models/medico')

let Usuario = require('../models/usuario')





//===========================================
//BUsqeuda coleccion
//===========================================


app.get('/coleccion/:tabla/:busqueda', (req, res, next) =>{
    
    let tabla = req.params.tabla;
    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda, 'i')

    let promesa;

    switch(tabla){
        case 'usuarios':
            promesa=buscarUsuarios(busqueda, regex);
            break;
        case 'medicos':
                promesa=buscarMedicos(busqueda, regex);
                break;
        case 'hospitales':
                promesa=buscarHospitales(busqueda, regex);
                break;
        default:
                return res.status(400).json({
                    ok:false,
                    mensaje:'Los tipos de busqueda solo osn : Usuarios Medicos o Hospitales'
                });

    }

    promesa.then( data =>{
        res.status(200).json({
            ok:false,
            [tabla]:data
    })
})


})




//===========================================
//BUsqeuda general
//===========================================

app.get('/todo/:busqueda', (req, res, next) =>{
    
    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda, 'i')

    Promise.all ([
        buscarHospitales(busqueda,regex),
        buscarMedicos(busqueda,regex),
        buscarUsuarios(busqueda,regex)])
        .then(respuestas=>{

            res.status(200).json({
                ok:true,
                hospitales:respuestas[0],
                medicos:respuestas[1],
                usuarios:respuestas[2]
            });
    
        })
});
function buscarHospitales(busqueda, regex){

    return new Promise((resolve, reject)=>{

        Hospital.find({nombre:regex})
        .populate('usuarios','nombre email')
        .exec(
        (err,hospitales)=>{ 

            if(err){
                reject('error al cargar', err);
            }else{
                resolve(hospitales);
            }
    
        });
    })
}


function buscarMedicos(busqueda, regex){

    return new Promise((resolve, reject)=>{

        Medico.find({nombre:regex})
        .populate('usuario','nombre email')
        .populate('hospital')
        .exec(
        (err,medicos)=>{

            if(err){
                reject('error al cargar medicos', err);
            }else{
                resolve(medicos);
            }
    
        });
    })
}


function buscarUsuarios(busqueda, regex){

    return new Promise((resolve, reject)=>{

        Usuario.find()
        .or([ {'nombre': regex}, {'email':regex} ])
        .exec((err,usuarios)=>{

            if(err){
                reject('error al cargar usuarios')
            }else{
                resolve(usuarios);
            }

        })
    })
}


module.exports = app;