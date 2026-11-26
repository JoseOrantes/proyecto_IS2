<?php

declare(strict_types=1);

const API_BASE_URL = 'http://localhost:3001/api';
const SESION_INACTIVIDAD_SEGUNDOS = 300;

function iniciarSesion(): void
{
    if (session_status() !== PHP_SESSION_NONE) {
        return;
    }
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => !empty($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

/**
 * Cierra la sesión y elimina la cookie del navegador.
 */
function cerrarSesion(): void
{
    iniciarSesion();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $parametros = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $parametros['path'], $parametros['domain'], $parametros['secure'], $parametros['httponly']);
    }
    session_destroy();
}

/**
 * Indica si la sesión lleva más de SESION_INACTIVIDAD_SEGUNDOS sin actividad.
 */
function sesionVencidaPorInactividad(int $ahora): bool
{
    $ultimaActividad = $_SESSION['ultima_actividad'] ?? null;
    return $ultimaActividad === null || $ahora - (int) $ultimaActividad > SESION_INACTIVIDAD_SEGUNDOS;
}

function e(mixed $valor): string
{
    return htmlspecialchars((string) $valor, ENT_QUOTES, 'UTF-8');
}

function moneda(float|string $monto): string
{
    return 'Q ' . number_format((float) $monto, 2, '.', ',');
}

/**
 * Formulario de eliminación. La confirmación la maneja js/app.js mediante data-confirm.
 */
function formularioEliminar(string $pagina, string $accion, mixed $id, string $mensaje): string
{
    return '<form method="post" action="index.php?page=' . e($pagina) . '" class="m-0" data-confirm="' . e($mensaje) . '">
                <input type="hidden" name="accion" value="' . e($accion) . '">
                <input type="hidden" name="id" value="' . e($id) . '">
                <button type="submit" class="btn btn-danger btn-sm">Eliminar</button>
            </form>';
}

/**
 * Botón que abre el modal de edición y le carga los valores actuales (js/app.js).
 */
function botonEditar(string $modalId, array $valores): string
{
    return '<button type="button" class="btn btn-outline-primary btn-sm" data-editar data-modal="#' . e($modalId) . '"'
        . ' data-valores="' . e(json_encode($valores, JSON_UNESCAPED_UNICODE)) . '">Editar</button>';
}

/**
 * Modal de edición. Los campos se llenan desde js/app.js; el id y la acción van ocultos.
 */
function modalEditar(string $modalId, string $titulo, string $pagina, string $accion, string $campos): string
{
    return '<div class="modal fade" id="' . e($modalId) . '" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <form method="post" action="index.php?page=' . e($pagina) . '" class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">' . e($titulo) . '</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" name="accion" value="' . e($accion) . '">
                    <input type="hidden" name="id">
                    ' . $campos . '
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar cambios</button>
                </div>
            </form>
        </div>
    </div>';
}

/**
 * Campo de formulario con etiqueta Bootstrap.
 */
function campoFormulario(string $etiqueta, string $html): string
{
    return '<div class="mb-3"><label class="form-label">' . e($etiqueta) . '</label>' . $html . '</div>';
}

