// REQUIERES
let express = require('express');
let mongoose = require('mongoose')
let bodyparser = require('body-parser');

// INICIALIZAR VARIABLES
let app = express();

// BOdy parser



app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json());

// IMPORTAR RUTAS

let appRoutes = require('./routes/app');
let usuarioRoutes = require('./routes/usuarios');
let loginRoutes = require('./routes/login');

// CONEXION A BASE DE DATOSK
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err, res) =>{
    if(err)throw err;
    console.log('Base de datos mongo: \x1b[46m%s\x1b[0m','online');

});


// RUTAS
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// ESCUCHAR PETICIONES

app.listen(3000,()=>{
    console.log('Express server is running in port 3000: \x1b[46m%s\x1b[0m','online');
    
})