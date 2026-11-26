<?php

declare(strict_types=1);

require_once __DIR__ . '/api_client.php';

function iniciarSesionApi(string $email, string $password): array
{
    return llamarApi('POST', '/auth/login', ['email' => $email, 'password' => $password]);
}
