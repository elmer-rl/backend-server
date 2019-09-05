let express = require('express');

let app = express();

const path = require('path')

const fs = require('fs')


// RUTAS

app.get('/:tipo/:img', (req, res, next) =>{
    
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../uploads/${ tipo }/${img}`);

    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen)
    }else{
        let pathNoimage = path.resolve(__dirname, '../assets/no-img.png');
        res.sendFile(pathNoimage)
    }    

    // res.status(200).json({
    //     ok:true,
    //     mensaje:'Petición realizada correctamente'
    // });

})

module.exports = app;