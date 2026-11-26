const ROLES = Object.freeze({
  ADMIN: 'Admin',
  GERENTE: 'Gerente',
  VENDEDOR: 'Vendedor',
});

const ROLE_LIST = Object.values(ROLES);

module.exports = { ROLES, ROLE_LIST };
