<?php

declare(strict_types=1);

require_once __DIR__ . '/api_client.php';

function listarCotizaciones(string $token): array
{
    return llamarApi('GET', '/cotizaciones', null, $token);
}

function crearCotizacion(string $token, array $datos): array
{
    return llamarApi('POST', '/cotizaciones', [
        'clienteId' => (int) $datos['cliente_id'],
        'vehiculoId' => (int) $datos['vehiculo_id'],
        'descuentoPct' => (float) ($datos['descuento_pct'] ?? 0),
    ], $token);
}

function aprobarCotizacion(string $token, int $id): array
{
    return llamarApi('PATCH', '/cotizaciones/' . $id . '/aprobar', null, $token);
}

function eliminarCotizacion(string $token, int $id): array
{
    return llamarApi('DELETE', '/cotizaciones/' . $id, null, $token);
}

function actualizarCotizacion(string $token, int $id, array $datos): array
{
    return llamarApi('PUT', '/cotizaciones/' . $id, [
        'clienteId' => (int) $datos['cliente_id'],
        'vehiculoId' => (int) $datos['vehiculo_id'],
        'descuentoPct' => (float) ($datos['descuento_pct'] ?? 0),
    ], $token);
}

function obtenerVentas(string $token): array
{
    return llamarApi('GET', '/reportes/ventas', null, $token);
}
