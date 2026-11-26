const authService = require('../services/auth.service');

async function login(req, res) {
  const resultado = await authService.login({
    email: req.body.email,
    password: req.body.password,
    ip: req.ip,
  });
  res.json(resultado);
}

module.exports = { login };
