<?php

declare(strict_types=1);

require_once __DIR__ . '/api_client.php';

function listarVehiculos(string $token): array
{
    return llamarApi('GET', '/vehiculos', null, $token);
}

function listarTiposVehiculo(string $token): array
{
    return llamarApi('GET', '/vehiculos/tipos', null, $token);
}

function crearVehiculo(string $token, array $datos): array
{
    return llamarApi('POST', '/vehiculos', $datos, $token);
}

function actualizarVehiculo(string $token, int $id, array $datos): array
{
    return llamarApi('PUT', '/vehiculos/' . $id, $datos, $token);
}

function eliminarVehiculo(string $token, int $id): array
{
    return llamarApi('DELETE', '/vehiculos/' . $id, null, $token);
}
