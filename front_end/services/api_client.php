<?php

declare(strict_types=1);

require_once __DIR__ . '/../db/db.php';

/**
 * Envía una petición JSON a la API y devuelve el código HTTP y el cuerpo decodificado.
 */
function llamarApi(string $metodo, string $ruta, ?array $datos = null, ?string $token = null): array
{
    $cabeceras = ['Accept: application/json', 'Content-Type: application/json'];
    if ($token !== null) {
        $cabeceras[] = 'Authorization: Bearer ' . $token;
    }

    $curl = curl_init(API_BASE_URL . $ruta);
    curl_setopt_array($curl, [
        CURLOPT_CUSTOMREQUEST => $metodo,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $cabeceras,
        CURLOPT_TIMEOUT => 10,
    ]);
    if ($datos !== null) {
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($datos, JSON_UNESCAPED_UNICODE));
    }

    $cuerpo = curl_exec($curl);
    if ($cuerpo === false) {
        $error = curl_error($curl);
        curl_close($curl);
        return ['status' => 503, 'data' => ['error' => 'No se pudo conectar con la API: ' . $error]];
    }

    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    curl_close($curl);

    $data = json_decode((string) $cuerpo, true);
    return ['status' => $status, 'data' => is_array($data) ? $data : []];
}

function exito(array $respuesta): bool
{
    return $respuesta['status'] >= 200 && $respuesta['status'] < 300;
}

function mensajeError(array $respuesta): string
{
    return $respuesta['data']['error'] ?? 'Ocurrió un error inesperado';
}
