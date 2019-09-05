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
let hospitalRoutes = require('./routes/hospital');
let medicoRoutes = require('./routes/medico');
let usuarioRoutes = require('./routes/usuarios');
let loginRoutes = require('./routes/login');
let busquedaRoutes = require('./routes/busqueda');
let uploadRoutes = require('./routes/upload');
let imagenesdRoutes = require('./routes/imagenes');

// CONEXION A BASE DE DATOSK
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err, res) =>{
    if(err)throw err;
    console.log('Base de datos mongo: \x1b[46m%s\x1b[0m','online');

});


// serve index config

let serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));


// RUTAS
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesdRoutes);
app.use('/', appRoutes);

// ESCUCHAR PETICIONES

app.listen(3000,()=>{
    console.log('Express server is running in port 3000: \x1b[46m%s\x1b[0m','online');
    
})