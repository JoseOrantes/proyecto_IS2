<?php

declare(strict_types=1);

require_once __DIR__ . '/../../services/cotizaciones_request.php';
require_once __DIR__ . '/../../services/clientes_request.php';
require_once __DIR__ . '/../../services/vehiculos_inventory.php';

function renderCotizaciones(string $token, array $usuario): void
{
    $respuesta = listarCotizaciones($token);
    $clientes = listarClientes($token);
    $vehiculos = listarVehiculos($token);
    $puedeAprobar = in_array($usuario['rol'], ['Admin', 'Gerente'], true);
    $esAdmin = $usuario['rol'] === 'Admin';

    echo '<h1>Cotizaciones</h1>';

    if (exito($clientes) && exito($vehiculos)) {
        echo '<section class="tarjeta"><h2>Nueva cotización</h2>
            <form method="post" action="index.php?page=cotizaciones" class="formulario">
                <input type="hidden" name="accion" value="crear_cotizacion">
                <label>Cliente <select name="cliente_id" required>' . opcionesClientes($clientes['data']) . '</select></label>
                <label>Vehículo <select name="vehiculo_id" required>' . opcionesVehiculos($vehiculos['data']) . '</select></label>
                <label>Descuento (%) <input type="number" name="descuento_pct" min="0" max="100" step="0.01" value="0"></label>
                <button type="submit">Crear cotización</button>
            </form></section>';
    }

    if (!exito($respuesta)) {
        echo '<p class="alerta error">' . e(mensajeError($respuesta)) . '</p>';
        return;
    }

    echo '<table><thead><tr><th>#</th><th>Cliente</th><th>Vendedor</th><th>Vehículo</th><th>Descuento</th><th>Total</th><th>Estado</th><th></th></tr></thead><tbody>';
    $modales = '';
    foreach ($respuesta['data'] as $cotizacion) {
        echo '<tr><td>' . e($cotizacion['id']) . '</td><td>' . e($cotizacion['cliente']) . '</td><td>'
            . e($cotizacion['vendedor']) . '</td><td>' . e($cotizacion['vehiculo']) . '</td><td>'
            . e($cotizacion['descuento_pct']) . '%</td><td>' . e(moneda($cotizacion['total'])) . '</td><td>'
            . e($cotizacion['estado']) . '</td><td>';
        echo '<div class="d-flex gap-2 flex-nowrap">';
        if ($puedeAprobar && $cotizacion['estado'] === 'Pendiente') {
            echo '<form method="post" action="index.php?page=cotizaciones" class="m-0" data-confirm="¿Aprobar esta cotización?">
                <input type="hidden" name="accion" value="aprobar_cotizacion">
                <input type="hidden" name="id" value="' . e($cotizacion['id']) . '">
                <button type="submit" class="btn btn-success btn-sm">Aprobar</button>
            </form>';
        }
        if ($esAdmin) {
            $modalId = 'modalCotizacion' . $cotizacion['id'];
            echo botonEditar($modalId, $cotizacion);
            echo formularioEliminar('cotizaciones', 'eliminar_cotizacion', $cotizacion['id'], '¿Eliminar la cotización #' . $cotizacion['id'] . '? Esta acción no se puede deshacer.');
            $modales .= modalEditar($modalId, 'Editar cotización #' . $cotizacion['id'], 'cotizaciones', 'actualizar_cotizacion',
                campoFormulario('Cliente', '<select class="form-select" name="cliente_id" required>' . opcionesClientes($clientes['data'] ?? []) . '</select>')
                . campoFormulario('Vehículo', '<select class="form-select" name="vehiculo_id" required>' . opcionesVehiculos($vehiculos['data'] ?? []) . '</select>')
                . campoFormulario('Descuento (%)', '<input class="form-control" type="number" name="descuento_pct" min="0" max="100" step="0.01">'));
        }
        echo '</div></td></tr>';
    }
    echo '</tbody></table>' . $modales;
}

function opcionesClientes(array $clientes): string
{
    $html = '';
    foreach ($clientes as $cliente) {
        $html .= '<option value="' . e($cliente['id']) . '">' . e($cliente['nombre']) . '</option>';
    }
    return $html;
}

function opcionesVehiculos(array $vehiculos): string
{
    $html = '';
    foreach ($vehiculos as $vehiculo) {
        $html .= '<option value="' . e($vehiculo['id']) . '">' . e($vehiculo['tipo'] . ' - ' . $vehiculo['modelo']) . '</option>';
    }
    return $html;
}

