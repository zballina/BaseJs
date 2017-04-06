var express = require('express');
var router = express.Router();
var path = require('path');

var usuarios = require('./api/usuarios');

router.get('/', function (req, res) {
    res.redirect(path.join(__dirname, 'public', 'index.html'));
});

router.get('/api/usuarios', usuarios.getAll);
router.get('/api/usuarios/:id', usuarios.get);
router.post('/api/usuarios', usuarios.create);
router.put('/api/usuarios', usuarios.edit);
router.delete('/api/usuarios/:id', usuarios.destroy);

module.exports = router;