-- AutoVentas GT - Esquema MariaDB (MVP)
-- Datos ficticios. No contiene credenciales: el usuario administrador se crea con scripts/seed.js (bcrypt).

CREATE DATABASE IF NOT EXISTS autoventas_gt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE autoventas_gt;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  rol ENUM('Admin', 'Gerente', 'Vendedor') NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(160) NOT NULL,
  exitoso TINYINT(1) NOT NULL,
  ip VARCHAR(64) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(160) NOT NULL,
  nit VARCHAR(20) NOT NULL UNIQUE,
  telefono VARCHAR(30) NULL,
  email VARCHAR(160) NULL,
  direccion VARCHAR(255) NULL,
  created_by INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS prospectos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(160) NOT NULL,
  telefono VARCHAR(30) NULL,
  email VARCHAR(160) NULL,
  fuente VARCHAR(80) NULL,
  estado ENUM('Nuevo', 'Contactado', 'Calificado', 'Convertido', 'Descartado') NOT NULL DEFAULT 'Nuevo',
  vendedor_id INT NOT NULL,
  cliente_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendedor_id) REFERENCES usuarios(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE IF NOT EXISTS tipos_vehiculo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS vehiculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo_id INT NOT NULL,
  marca VARCHAR(80) NOT NULL,
  modelo VARCHAR(80) NOT NULL,
  anio SMALLINT NOT NULL,
  precio DECIMAL(12, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  descripcion VARCHAR(500) NULL,
  imagen VARCHAR(255) NULL,
  FOREIGN KEY (tipo_id) REFERENCES tipos_vehiculo(id)
);

CREATE TABLE IF NOT EXISTS cotizaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  vendedor_id INT NOT NULL,
  vehiculo_id INT NOT NULL,
  precio_lista DECIMAL(12, 2) NOT NULL,
  descuento_pct DECIMAL(5, 2) NOT NULL DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,
  estado ENUM('Pendiente', 'Aprobada') NOT NULL,
  aprobado_por INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (vendedor_id) REFERENCES usuarios(id),
  FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id),
  FOREIGN KEY (aprobado_por) REFERENCES usuarios(id)
);

-- Catálogo inicial: 5 tipos de vehículo con datos ficticios.
INSERT IGNORE INTO tipos_vehiculo (id, nombre) VALUES
  (1, 'Carro'),
  (2, 'Pick-up'),
  (3, 'Camión pequeño estilo HINO'),
  (4, 'Minivan'),
  (5, 'Coupé');

INSERT IGNORE INTO vehiculos (id, tipo_id, marca, modelo, anio, precio, stock, descripcion, imagen) VALUES
  (1, 1, 'Marca Demo', 'Sedán Urbano 1.6', 2026, 185000.00, 6, 'Sedán compacto de uso familiar.', 'imagenes/1_carro.png'),
  (2, 2, 'Marca Demo', 'Pick-up Trabajo 2.4', 2026, 265000.00, 4, 'Pick-up cabina sencilla para carga.', 'imagenes/2_pickup.png'),
  (3, 3, 'Marca Demo', 'Camión Liviano 4T', 2025, 390000.00, 2, 'Camión de caja pequeño para distribución urbana.', 'imagenes/3_camion_estilo_hino.png'),
  (4, 4, 'Marca Demo', 'Minivan Familiar 7P', 2026, 230000.00, 3, 'Minivan de siete pasajeros.', 'imagenes/4_minivan.png'),
  (5, 5, 'Marca Demo', 'Coupé Deportivo 2.0', 2026, 245000.00, 2, 'Coupé de dos puertas con perfil deportivo.', 'imagenes/5_coupe.png');

-- Datos de demostración (ficticios). Son idempotentes: seed.js vuelve a ejecutar este archivo.
INSERT IGNORE INTO clientes (nombre, nit, telefono, email, direccion, created_by) VALUES
  ('Carlos Mendoza Pérez', '1000001-1', '5512-3001', 'carlos.mendoza@correo.test', 'Zona 10, Ciudad de Guatemala', 1),
  ('Ana Lucía Rodríguez', '1000002-2', '5512-3002', 'ana.rodriguez@correo.test', 'Mixco, zona 1', 1),
  ('Transportes Del Valle, S.A.', '1000003-3', '2445-7810', 'ventas@transvalle.test', 'Villa Nueva', 1),
  ('Luis Fernando Ixcot', '1000004-4', '5512-3004', 'luis.ixcot@correo.test', 'Antigua Guatemala', 1),
  ('Distribuidora Maya, S.A.', '1000005-5', '2330-9900', 'compras@distmaya.test', 'Zona 4, Ciudad de Guatemala', 1),
  ('María José Sandoval', '1000006-6', '5512-3006', 'mjsandoval@correo.test', 'Escuintla', 1),
  ('Ferretería El Progreso', '1000007-7', '2450-1122', 'info@ferreprogreso.test', 'Zona 12, Ciudad de Guatemala', 1),
  ('Roberto Castillo', '1000008-8', '5512-3008', 'roberto.castillo@correo.test', 'Quetzaltenango', 1);

INSERT INTO prospectos (nombre, telefono, email, fuente, estado, vendedor_id, cliente_id)
SELECT 'Sofía Herrera', '5512-4001', 'sofia.herrera@correo.test', 'Web', 'Nuevo', 3, NULL FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM prospectos WHERE nombre = 'Sofía Herrera');

INSERT INTO prospectos (nombre, telefono, email, fuente, estado, vendedor_id, cliente_id)
SELECT 'Jorge Morales', '5512-4002', 'jorge.morales@correo.test', 'Feria automotriz', 'Contactado', 3, NULL FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM prospectos WHERE nombre = 'Jorge Morales');

INSERT INTO prospectos (nombre, telefono, email, fuente, estado, vendedor_id, cliente_id)
SELECT 'Patricia Ruiz', '5512-4003', 'pruiz@correo.test', 'Referido', 'Calificado', 3, NULL FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM prospectos WHERE nombre = 'Patricia Ruiz');

INSERT INTO prospectos (nombre, telefono, email, fuente, estado, vendedor_id, cliente_id)
SELECT 'Taller Hermanos Cruz', '2412-5500', 'cotiza@hcruz.test', 'Llamada entrante', 'Contactado', 3, NULL FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM prospectos WHERE nombre = 'Taller Hermanos Cruz');

INSERT INTO prospectos (nombre, telefono, email, fuente, estado, vendedor_id, cliente_id)
SELECT 'Diego Estrada', '5512-4005', 'diego.estrada@correo.test', 'Redes sociales', 'Descartado', 3, NULL FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM prospectos WHERE nombre = 'Diego Estrada');

INSERT INTO prospectos (nombre, telefono, email, fuente, estado, vendedor_id, cliente_id)
SELECT 'Lorena Pineda', '5512-4006', 'lorena.pineda@correo.test', 'Web', 'Convertido', 3, (SELECT id FROM clientes WHERE nit = '1000006-6') FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM prospectos WHERE nombre = 'Lorena Pineda');

INSERT INTO prospectos (nombre, telefono, email, fuente, estado, vendedor_id, cliente_id)
SELECT 'Grupo Logístico Norte', '2470-8800', 'compras@logisticanorte.test', 'Referido', 'Calificado', 3, NULL FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM prospectos WHERE nombre = 'Grupo Logístico Norte');

INSERT INTO prospectos (nombre, telefono, email, fuente, estado, vendedor_id, cliente_id)
SELECT 'Andrés Lemus', '5512-4008', 'andres.lemus@correo.test', 'Feria automotriz', 'Convertido', 3, (SELECT id FROM clientes WHERE nit = '1000001-1') FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM prospectos WHERE nombre = 'Andrés Lemus');

INSERT INTO cotizaciones (cliente_id, vendedor_id, vehiculo_id, precio_lista, descuento_pct, total, estado, aprobado_por)
SELECT (SELECT id FROM clientes WHERE nit = '1000001-1'), 3, 1, 185000.00, 0, 185000.00, 'Pendiente', NULL FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM cotizaciones WHERE cliente_id = (SELECT id FROM clientes WHERE nit = '1000001-1') AND vehiculo_id = 1);

INSERT INTO cotizaciones (cliente_id, vendedor_id, vehiculo_id, precio_lista, descuento_pct, total, estado, aprobado_por)
SELECT (SELECT id FROM clientes WHERE nit = '1000003-3'), 3, 3, 390000.00, 5.00, 370500.00, 'Pendiente', NULL FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM cotizaciones WHERE cliente_id = (SELECT id FROM clientes WHERE nit = '1000003-3') AND vehiculo_id = 3);

INSERT INTO cotizaciones (cliente_id, vendedor_id, vehiculo_id, precio_lista, descuento_pct, total, estado, aprobado_por)
SELECT (SELECT id FROM clientes WHERE nit = '1000005-5'), 3, 4, 230000.00, 3.00, 223100.00, 'Aprobada', 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM cotizaciones WHERE cliente_id = (SELECT id FROM clientes WHERE nit = '1000005-5') AND vehiculo_id = 4);
