<?php

declare(strict_types=1);

require_once __DIR__ . '/api_client.php';

function listarClientes(string $token): array
{
    return llamarApi('GET', '/clientes', null, $token);
}

function eliminarCliente(string $token, int $id): array
{
    return llamarApi('DELETE', '/clientes/' . $id, null, $token);
}

function actualizarCliente(string $token, int $id, array $datos): array
{
    return llamarApi('PUT', '/clientes/' . $id, $datos, $token);
}

