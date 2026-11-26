<?php

declare(strict_types=1);

require_once __DIR__ . '/api_client.php';

function listarProspectos(string $token): array
{
    return llamarApi('GET', '/prospectos', null, $token);
}

function crearProspecto(string $token, array $datos): array
{
    return llamarApi('POST', '/prospectos', $datos, $token);
}

function convertirProspecto(string $token, int $id, string $nit): array
{
    return llamarApi('POST', '/prospectos/' . $id . '/convertir', ['nit' => $nit], $token);
}

function obtenerFunnel(string $token): array
{
    return llamarApi('GET', '/reportes/funnel', null, $token);
}

function eliminarProspecto(string $token, int $id): array
{
    return llamarApi('DELETE', '/prospectos/' . $id, null, $token);
}

function actualizarProspecto(string $token, int $id, array $datos): array
{
    return llamarApi('PUT', '/prospectos/' . $id, $datos, $token);
}
