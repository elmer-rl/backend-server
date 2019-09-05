let express = require('express');


let app = express();

let mAutenticacion = require('../middleware/autenticacion')



let Hospital = require('../models/hospital')


//===========================================
//Obtener todos los hospitales
//===========================================

app.get('/', (req, res, next) =>{
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde )
        .limit(5)
        .populate('usuario','nombre email')
        .exec(
            (err, hospitales)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    mensaje:'error cargando hospitales',
                    errors:err
                });
            }
    
            Hospital.count({},(err,conteo)=>{

            res.status(200).json({
                ok:true,
                hospitales: hospitales,
                total : conteo
            });
            })

    
        })
    
    });
    






//===========================================
//Actualizar todos los hospitales
//===========================================


app.put('/:id',mAutenticacion.verificaTOken,(req, res)=>{

    let id = req.params.id;
    let body = req.body;

    Hospital.findById(id, (err, hospital)=>{
        
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'error a buscar hospital',
                errors:err
            });
        }

        if(!hospital){
            return res.status(400).json({
                ok:false,
                mensaje:'el hospital con el id' + id + ' no existe',
                errors: {message:'no existe un hospital con este id'}
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario=req.usuario._id

        hospital.save( (err, hospitalGuardado)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:'error al actualizar hospital',
                    errors:err
                });
            }

            res.status(200).json({
                ok:true,
                hospital: hospitalGuardado
            });


        })

    });

});




//===========================================
//Crear nuevo Hospital
//===========================================

app.post('/',mAutenticacion.verificaTOken,(req, res) =>{

    let body = req.body; 

    hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado)=>{
       if(err){
           return res.status(400).json({
               ok:false,
               mensaje:'error al crear hospital',
               errors:err
           });;
       }

       res.status(201).json({
           ok:true,
           hospital: hospitalGuardado
       });
    });

    
})




//===========================================
//Borrar un hospital
//===========================================

app.delete('/:id' ,mAutenticacion.verificaTOken ,(req, res)=>{
    let id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'error al borrar hospital',
                errors:err
            });;
        }


        if(!hospitalBorrado){
            return res.status(400).json({
                ok:false,
                mensaje:'No existe el hospital con ese id',
                errors:{message:'No existe el hospital con ese id'}
            });;
        }

        res.status(200).json({
            ok:true,
            hospital: hospitalBorrado
        });

    });
});



module.exports = app