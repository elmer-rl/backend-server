let express = require('express');

let app = express();


// RUTAS

app.get('/', (req, res, next) =>{
    
    res.status(200).json({
        ok:true,
        mensaje:'Petición realizada correctamente'
    });

})

module.exports = app;