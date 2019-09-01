// REQUIERES
let express = require('express');
let mongoose = require('mongoose')


// INICIALIZAR VARIABLES
let app = express();


// CONEXION A BASE DE DATOSK
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err, res) =>{
    if(err)throw err;
    console.log('Base de datos mongo: \x1b[46m%s\x1b[0m','online');

});


// RUTAS

app.get('/', (req, res, next) =>{
    
    res.status(200).json({
        ok:true,
        mensaje:'Petición realizada correctamente'
    });

})



// ESCUCHAR PETICIONES

app.listen(3000,()=>{
    console.log('Express server is running in port 3000: \x1b[46m%s\x1b[0m','online');
    
})