<?php

declare(strict_types=1);

require_once __DIR__ . '/../../services/prospectos_request.php';
require_once __DIR__ . '/../../services/cotizaciones_request.php';

function renderDashboard(string $token, array $usuario): void
{
    echo '<h1>Inicio</h1>';
    echo '<p>Bienvenido, ' . e($usuario['nombre']) . ' (' . e($usuario['rol']) . ').</p>';

    if (!in_array($usuario['rol'], ['Admin', 'Gerente'], true)) {
        echo '<p>Los reportes gerenciales están disponibles para Gerentes y Administradores.</p>';
        return;
    }

    $funnel = obtenerFunnel($token);
    $ventas = obtenerVentas($token);

    echo '<h2>Funnel de prospectos</h2>';
    if (!exito($funnel)) {
        echo '<p class="alerta error">' . e(mensajeError($funnel)) . '</p>';
    } else {
        echo '<p>Total de prospectos: <strong>' . e($funnel['data']['total']) . '</strong></p>';
        echo '<table><thead><tr><th>Estado</th><th>Cantidad</th></tr></thead><tbody>';
        foreach ($funnel['data']['porEstado'] as $fila) {
            echo '<tr><td>' . e($fila['estado']) . '</td><td>' . e($fila['cantidad']) . '</td></tr>';
        }
        echo '</tbody></table>';
    }

    echo '<h2>Ventas aprobadas</h2>';
    if (!exito($ventas)) {
        echo '<p class="alerta error">' . e(mensajeError($ventas)) . '</p>';
    } else {
        echo '<p>Monto total aprobado: <strong>' . e(moneda($ventas['data']['montoTotal'])) . '</strong></p>';
        echo '<table><thead><tr><th>Vendedor</th><th>Cotizaciones</th><th>Monto</th></tr></thead><tbody>';
        foreach ($ventas['data']['porVendedor'] as $fila) {
            echo '<tr><td>' . e($fila['vendedor']) . '</td><td>' . e($fila['cotizaciones_aprobadas'])
                . '</td><td>' . e(moneda($fila['monto_total'])) . '</td></tr>';
        }
        echo '</tbody></table>';
    }
}
