<?php

declare(strict_types=1);

require_once __DIR__ . '/../../services/usuarios_request.php';

function renderUsuarios(string $token, int $idActual = 0): void
{
    $respuesta = listarUsuarios($token);
    echo '<h1>Usuarios y roles</h1>';

    echo '<section class="tarjeta"><h2>Nuevo usuario</h2>
        <form method="post" action="index.php?page=usuarios" class="formulario">
            <input type="hidden" name="accion" value="crear_usuario">
            <label>Nombre <input name="nombre" required></label>
            <label>Correo <input type="email" name="email" required></label>
            <label>Contraseña (mínimo 8) <input type="password" name="password" minlength="8" required></label>
            <label>Rol <select name="rol">
                <option>Vendedor</option><option>Gerente</option><option>Admin</option>
            </select></label>
            <button type="submit">Guardar</button>
        </form></section>';

    if (!exito($respuesta)) {
        echo '<p class="alerta error">' . e(mensajeError($respuesta)) . '</p>';
        return;
    }

    echo '<table><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Activo</th><th></th></tr></thead><tbody>';
    $modales = '';
    foreach ($respuesta['data'] as $usuario) {
        $activo = (int) $usuario['activo'] === 1;
        $modalId = 'modalUsuario' . $usuario['id'];
        echo '<tr><td>' . e($usuario['nombre']) . '</td><td>' . e($usuario['email']) . '</td><td>'
            . e($usuario['rol']) . '</td><td>' . ($activo ? 'Sí' : 'No') . '</td><td>
            <div class="d-flex gap-2 flex-nowrap">' . botonEditar($modalId, [
                'id' => $usuario['id'],
                'nombre' => $usuario['nombre'],
                'rol' => $usuario['rol'],
                'activo' => $activo,
            ]);
        if ((int) $usuario['id'] !== $idActual) {
            echo formularioEliminar('usuarios', 'eliminar_usuario', $usuario['id'], '¿Eliminar al usuario ' . $usuario['nombre'] . '? Esta acción no se puede deshacer.');
        }
        echo '</div></td></tr>';
        $modales .= modalEditar($modalId, 'Editar usuario', 'usuarios', 'actualizar_usuario',
            campoFormulario('Nombre', '<input class="form-control" name="nombre" required>')
            . campoFormulario('Rol', '<select class="form-select" name="rol"><option>Vendedor</option><option>Gerente</option><option>Admin</option></select>')
            . '<div class="form-check"><input class="form-check-input" type="checkbox" name="activo" value="1" id="activo' . e($usuario['id']) . '">'
            . '<label class="form-check-label" for="activo' . e($usuario['id']) . '">Activo</label></div>');
    }
    echo '</tbody></table>' . $modales;
}
