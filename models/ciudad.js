var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ciudadSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'ciudades' });



module.exports = mongoose.model('Ciudad', ciudadSchema);