<?php

declare(strict_types=1);

require_once __DIR__ . '/db/db.php';
require_once __DIR__ . '/services/api_client.php';
require_once __DIR__ . '/services/login_request.php';
require_once __DIR__ . '/services/clientes_request.php';
require_once __DIR__ . '/services/prospectos_request.php';
require_once __DIR__ . '/services/cotizaciones_request.php';
require_once __DIR__ . '/services/usuarios_request.php';
require_once __DIR__ . '/services/vehiculos_inventory.php';
require_once __DIR__ . '/src/login/login.php';
require_once __DIR__ . '/src/dashboard/dashboard.php';
require_once __DIR__ . '/src/clientes/clientes.php';
require_once __DIR__ . '/src/prospectos/prospectos.php';
require_once __DIR__ . '/src/vehiculos/vehiculos.php';
require_once __DIR__ . '/src/cotizaciones/cotizaciones.php';
require_once __DIR__ . '/src/usuarios/usuarios.php';

iniciarSesion();

const PAGINAS = [
    'dashboard' => ['etiqueta' => 'Inicio', 'roles' => ['Admin', 'Gerente', 'Vendedor']],
    'clientes' => ['etiqueta' => 'Clientes', 'roles' => ['Admin', 'Gerente', 'Vendedor']],
    'prospectos' => ['etiqueta' => 'Prospectos', 'roles' => ['Admin', 'Gerente', 'Vendedor']],
    'vehiculos' => ['etiqueta' => 'Vehículos', 'roles' => ['Admin', 'Gerente', 'Vendedor']],
    'cotizaciones' => ['etiqueta' => 'Cotizaciones', 'roles' => ['Admin', 'Gerente', 'Vendedor']],
    'usuarios' => ['etiqueta' => 'Usuarios', 'roles' => ['Admin']],
];

function campo(string $nombre): string
{
    return trim((string) ($_POST[$nombre] ?? ''));
}

function datosVehiculo(): array
{
    return [
        'tipoId' => (int) campo('tipo_id'),
        'marca' => campo('marca'),
        'modelo' => campo('modelo'),
        'anio' => (int) campo('anio'),
        'precio' => (float) campo('precio'),
        'stock' => (int) campo('stock'),
        'descripcion' => campo('descripcion'),
        'imagen' => campo('imagen'),
    ];
}

function redirigir(string $pagina): never
{
    header('Location: index.php?page=' . $pagina);
    exit;
}

function notificar(array $respuesta, string $mensajeExito, string $pagina): never
{
    $_SESSION['flash'] = exito($respuesta)
        ? ['tipo' => 'exito', 'mensaje' => $mensajeExito]
        : ['tipo' => 'error', 'mensaje' => mensajeError($respuesta)];
    redirigir($pagina);
}

if (isset($_GET['salir'])) {
    cerrarSesion();
    header('Location: index.php');
    exit;
}

$errorLogin = null;

if (($_POST['accion'] ?? '') === 'login') {
    $respuesta = iniciarSesionApi(campo('email'), (string) ($_POST['password'] ?? ''));
    if (exito($respuesta)) {
        session_regenerate_id(true);
        $_SESSION['token'] = $respuesta['data']['token'];
        $_SESSION['usuario'] = $respuesta['data']['usuario'];
        $_SESSION['ultima_actividad'] = time();
        redirigir('dashboard');
    }
    $errorLogin = mensajeError($respuesta);
}

if (isset($_SESSION['token']) && sesionVencidaPorInactividad(time())) {
    cerrarSesion();
    $errorLogin = 'Tu sesión venció por inactividad. Inicia sesión de nuevo.';
}

$autenticado = session_id() !== '' && isset($_SESSION['token'], $_SESSION['usuario']);

if ($autenticado) {
    $_SESSION['ultima_actividad'] = time();
}

if ($autenticado && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_SESSION['token'];
    $accion = $_POST['accion'] ?? '';

    switch ($accion) {
        case 'crear_cliente':
            notificar(crearCliente($token, [
                'nombre' => campo('nombre'),
                'nit' => campo('nit'),
                'telefono' => campo('telefono'),
                'email' => campo('email'),
                'direccion' => campo('direccion'),
            ]), 'Cliente creado correctamente', 'clientes');

        case 'crear_prospecto':
            notificar(crearProspecto($token, [
                'nombre' => campo('nombre'),
                'telefono' => campo('telefono'),
                'email' => campo('email'),
                'fuente' => campo('fuente'),
            ]), 'Prospecto registrado correctamente', 'prospectos');

        case 'convertir_prospecto':
            notificar(convertirProspecto($token, (int) ($_POST['id'] ?? 0), campo('nit')),
                'Prospecto convertido a cliente', 'prospectos');

        case 'crear_cotizacion':
            notificar(crearCotizacion($token, [
                'cliente_id' => campo('cliente_id'),
                'vehiculo_id' => campo('vehiculo_id'),
                'descuento_pct' => campo('descuento_pct'),
            ]), 'Cotización creada correctamente', 'cotizaciones');

        case 'aprobar_cotizacion':
            notificar(aprobarCotizacion($token, (int) ($_POST['id'] ?? 0)),
                'Cotización aprobada', 'cotizaciones');

        case 'eliminar_cliente':
            notificar(eliminarCliente($token, (int) ($_POST['id'] ?? 0)),
                'Cliente eliminado', 'clientes');

        case 'eliminar_prospecto':
            notificar(eliminarProspecto($token, (int) ($_POST['id'] ?? 0)),
                'Prospecto eliminado', 'prospectos');

        case 'eliminar_cotizacion':
            notificar(eliminarCotizacion($token, (int) ($_POST['id'] ?? 0)),
                'Cotización eliminada', 'cotizaciones');

        case 'actualizar_cliente':
            notificar(actualizarCliente($token, (int) ($_POST['id'] ?? 0), [
                'nombre' => campo('nombre'),
                'telefono' => campo('telefono'),
                'email' => campo('email'),
                'direccion' => campo('direccion'),
            ]), 'Cliente actualizado correctamente', 'clientes');

        case 'actualizar_prospecto':
            notificar(actualizarProspecto($token, (int) ($_POST['id'] ?? 0), [
                'nombre' => campo('nombre'),
                'telefono' => campo('telefono'),
                'email' => campo('email'),
                'fuente' => campo('fuente'),
                'estado' => campo('estado'),
            ]), 'Prospecto actualizado correctamente', 'prospectos');

        case 'actualizar_cotizacion':
            notificar(actualizarCotizacion($token, (int) ($_POST['id'] ?? 0), [
                'cliente_id' => campo('cliente_id'),
                'vehiculo_id' => campo('vehiculo_id'),
                'descuento_pct' => campo('descuento_pct'),
            ]), 'Cotización actualizada correctamente', 'cotizaciones');

        case 'crear_vehiculo':
            notificar(crearVehiculo($token, datosVehiculo()),
                'Vehículo registrado correctamente', 'vehiculos');

        case 'actualizar_vehiculo':
            notificar(actualizarVehiculo($token, (int) ($_POST['id'] ?? 0), datosVehiculo()),
                'Vehículo actualizado correctamente', 'vehiculos');

        case 'eliminar_vehiculo':
            notificar(eliminarVehiculo($token, (int) ($_POST['id'] ?? 0)),
                'Vehículo eliminado', 'vehiculos');

        case 'crear_usuario':
            notificar(crearUsuario($token, [
                'nombre' => campo('nombre'),
                'email' => campo('email'),
                'password' => (string) ($_POST['password'] ?? ''),
                'rol' => campo('rol'),
            ]), 'Usuario creado correctamente', 'usuarios');

        case 'actualizar_usuario':
            notificar(actualizarUsuario($token, (int) ($_POST['id'] ?? 0), [
                'nombre' => campo('nombre'),
                'rol' => campo('rol'),
                'activo' => isset($_POST['activo']),
            ]), 'Usuario actualizado correctamente', 'usuarios');

        case 'eliminar_usuario':
            notificar(eliminarUsuario($token, (int) ($_POST['id'] ?? 0)),
                'Usuario eliminado', 'usuarios');
    }
}

$paginaSolicitada = $_GET['page'] ?? 'dashboard';
$usuario = $_SESSION['usuario'] ?? null;
$pagina = 'dashboard';
if ($autenticado && isset(PAGINAS[$paginaSolicitada]) && in_array($usuario['rol'], PAGINAS[$paginaSolicitada]['roles'], true)) {
    $pagina = $paginaSolicitada;
}

$flash = $_SESSION['flash'] ?? null;
unset($_SESSION['flash']);
?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>AutoVentas GT - CRM</title>
    <link rel="stylesheet" href="bootstrap-5.0.2-dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="css/app.css">
    <script src="bootstrap-5.0.2-dist/js/bootstrap.bundle.min.js" defer></script>
    <script src="js/app.js" defer></script>
</head>
<body class="<?= $autenticado ? 'con-sesion' : 'sin-sesion' ?>">
<?php if (!$autenticado): ?>
    <?php renderLogin($errorLogin); ?>
<?php else: ?>
    <header>
        <strong>AutoVentas GT</strong>
        <nav>
            <?php foreach (PAGINAS as $clave => $configuracion): ?>
                <?php if (in_array($usuario['rol'], $configuracion['roles'], true)): ?>
                    <a href="index.php?page=<?= e($clave) ?>"<?= $clave === $pagina ? ' class="activo"' : '' ?>><?= e($configuracion['etiqueta']) ?></a>
                <?php endif; ?>
            <?php endforeach; ?>
        </nav>
        <span><?= e($usuario['nombre']) ?> (<?= e($usuario['rol']) ?>) · <a href="index.php?salir=1" data-confirm="¿Desea cerrar sesión?">Salir</a></span>
    </header>

    <?php if ($flash !== null): ?>
        <p class="alerta <?= $flash['tipo'] === 'exito' ? 'exito' : 'error' ?>"><?= e($flash['mensaje']) ?></p>
    <?php endif; ?>

    <main>
        <?php
        $token = $_SESSION['token'];
        match ($pagina) {
            'dashboard' => renderDashboard($token, $usuario),
            'clientes' => renderClientes($token, $usuario['rol'] === 'Admin'),
            'prospectos' => renderProspectos($token, $usuario['rol'] === 'Admin'),
            'vehiculos' => renderVehiculos($token, $usuario['rol'] === 'Admin'),
            'cotizaciones' => renderCotizaciones($token, $usuario),
            'usuarios' => renderUsuarios($token, (int) $usuario['id']),
        };
        ?>
    </main>
<?php endif; ?>

<div class="modal fade" id="modalConfirmacion" tabindex="-1" aria-labelledby="modalConfirmacionTitulo" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalConfirmacionTitulo">Confirmar acción</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body" id="modalConfirmacionMensaje"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="modalConfirmacionAceptar">Aceptar</button>
            </div>
        </div>
    </div>
</div>
</body>
</html>
