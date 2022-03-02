var express = require('express');

var app = express();

var Ciudad = require('../models/ciudad');


// ============================================
// Obtener todas las ciudades
// ============================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Ciudad.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre')
        .exec(
            (err, ciudades) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando ciudad',
                        errors: err
                    });
                }

                Ciudad.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        ciudades: ciudades,
                        total: conteo
                    });
                });

            });
});

// ==========================================
//  Obtener ciudad por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Ciudad.findById(id)
        .populate('usuario', 'nombre img')
        .exec((err, ciudad) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar ciudad',
                    errors: err
                });
            }

            if (!ciudad) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La ciudad con el id ' + id + 'no existe',
                    errors: { message: 'No existe una ciudad con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                ciudad: ciudad
            });
        });
});


// ==========================================
// Actualizar Ciudad
// ==========================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Ciudad.findById(id, (err, ciudad) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar ciudad',
                errors: err
            });
        }

        if (!ciudad) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El ciudad con el id ' + id + ' no existe',
                errors: { message: 'No existe un ciudad con ese ID' }
            });
        }


        ciudad.nombre = body.nombre;
        ciudad.usuario = req.ciudad._id;

        ciudad.save((err, ciudadGuardada) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar ciudad',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                ciudad: ciudadGuardada
            });

        });

    });

});



// ==============================================
// Crear una nueva Ciudad
// ==============================================

app.post('/', (req, res) => {

    var body = req.body;

    var ciudad = new Ciudad({
        nombre: body.nombre,
        usuario: req.usuario
    });

    ciudad.save((err, ciudadGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear la ciudad',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            ciudad: ciudadGuardada
        });

    });


});

// ============================================
//   Borrar una ciudad por el id
// ============================================
app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Ciudad.findByIdAndRemove(id, (err, ciudadBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar ciudad',
                errors: err
            });
        }

        if (!ciudadBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una ciudad con ese id',
                errors: { message: 'No existe una ciudad con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            ciudad: ciudadBorrada
        });

    });

});


module.exports = app;