let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let medicoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id hospital esun campo obligatorio'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }

    });

    
module.exports = mongoose.model('Medico', medicoSchema);