<?php

declare(strict_types=1);

require_once __DIR__ . '/api_client.php';

function listarUsuarios(string $token): array
{
    return llamarApi('GET', '/usuarios', null, $token);
}

function crearUsuario(string $token, array $datos): array
{
    return llamarApi('POST', '/usuarios', $datos, $token);
}

function actualizarUsuario(string $token, int $id, array $datos): array
{
    return llamarApi('PUT', '/usuarios/' . $id, $datos, $token);
}

function eliminarUsuario(string $token, int $id): array
{
    return llamarApi('DELETE', '/usuarios/' . $id, null, $token);
}
