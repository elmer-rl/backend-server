let express = require('express');


let app = express();

let mAutenticacion = require('../middleware/autenticacion')



let Medico = require('../models/medico')




//===========================================
//Obtener todos los Medicos
//===========================================

app.get('/', (req, res, next) =>{

    let desde = req.query.desde || 0;
    desde = Number(desde);
    
    Medico.find({})
        .skip(desde )
        .limit(5)
        .populate('usuario','nombre email')  
        .populate('hospital')     
        .exec(  
            (err, medicos)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    mensaje:'error cargando medicos',
                    errors:err
                });;
            }

            Medico.count({},(err,conteo)=>{
                res.status(200).json({
                    ok:true,
                    medicos: medicos,
                    total:conteo
                });
            })
    
 
    
        })
    
    });
    






//===========================================
//Actualizar todos los medicos
//===========================================


app.put('/:id',mAutenticacion.verificaTOken,(req, res)=>{

    let id = req.params.id;
    let body = req.body;

    Medico.findById(id, (err, medico)=>{
        
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'error a buscar medico',
                errors:err
            });
        }

        if(!medico){
            return res.status(400).json({
                ok:false,
                mensaje:'el medico con el id' + id + ' no existe',
                errors: {message:'no existe un medico con este id'}
            });
        }

        medico.nombre = body.nombre;
        medico.usuario=req.usuario._id;
        medico.hospital=body.hospital
        
        medico.save( (err, medicoGuardado)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:'error al actualizar medico',
                    errors:err
                });
            }

            res.status(200).json({
                ok:true,
                medico: medicoGuardado
            });


        })

    });

});




//===========================================
//Crear nuevo Medico
//===========================================

app.post('/',mAutenticacion.verificaTOken,(req, res) =>{

    let body = req.body; 

    medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital : body.hospital
    });

    medico.save((err, medicoGuardado)=>{
       if(err){
           return res.status(400).json({
               ok:false,
               mensaje:'error al crear medico',
               errors:err
           });;
       }

       res.status(201).json({
           ok:true,
           medico: medicoGuardado
       });
    });

    
})




//===========================================
//Borrar un hospital
//===========================================

app.delete('/:id',mAutenticacion.verificaTOken,(req, res)=>{
    let id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'error al borrar medico',
                errors:err
            });;
        }


        if(!medicoBorrado){
            return res.status(400).json({
                ok:false,
                mensaje:'No existe el medico con ese id',
                errors:{message:'No existe el medico con ese id'}
            });;
        }

        res.status(200).json({
            ok:true,
            medico: medicoBorrado
        });

    });
});



module.exports = app