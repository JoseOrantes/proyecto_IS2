<?php

declare(strict_types=1);

require_once __DIR__ . '/../../services/clientes_request.php';

function renderClientes(string $token, bool $esAdmin = false): void
{
    $respuesta = listarClientes($token);
    echo '<h1>Clientes</h1>';

    echo '<section class="tarjeta"><h2>Nuevo cliente</h2>
        <form method="post" action="index.php?page=clientes" class="formulario">
            <input type="hidden" name="accion" value="crear_cliente">
            <label>Nombre <input name="nombre" required></label>
            <label>NIT <input name="nit" required></label>
            <label>Teléfono <input name="telefono"></label>
            <label>Correo <input type="email" name="email"></label>
            <label>Dirección <input name="direccion"></label>
            <button type="submit">Guardar</button>
        </form></section>';

    if (!exito($respuesta)) {
        echo '<p class="alerta error">' . e(mensajeError($respuesta)) . '</p>';
        return;
    }

    echo '<table><thead><tr><th>Nombre</th><th>NIT</th><th>Teléfono</th><th>Correo</th><th>Dirección</th>' . ($esAdmin ? '<th></th>' : '') . '</tr></thead><tbody>';
    $modales = '';
    foreach ($respuesta['data'] as $cliente) {
        echo '<tr><td>' . e($cliente['nombre']) . '</td><td>' . e($cliente['nit']) . '</td><td>'
            . e($cliente['telefono']) . '</td><td>' . e($cliente['email']) . '</td><td>'
            . e($cliente['direccion']) . '</td>';
        if ($esAdmin) {
            $modalId = 'modalCliente' . $cliente['id'];
            echo '<td class="d-flex gap-2 flex-nowrap">' . botonEditar($modalId, $cliente)
                . formularioEliminar('clientes', 'eliminar_cliente', $cliente['id'], '¿Eliminar al cliente ' . $cliente['nombre'] . '? Esta acción no se puede deshacer.') . '</td>';
            $modales .= modalEditar($modalId, 'Editar cliente', 'clientes', 'actualizar_cliente',
                campoFormulario('Nombre', '<input class="form-control" name="nombre" required>')
                . campoFormulario('NIT (no editable)', '<input class="form-control" name="nit" disabled>')
                . campoFormulario('Teléfono', '<input class="form-control" name="telefono">')
                . campoFormulario('Correo', '<input class="form-control" type="email" name="email">')
                . campoFormulario('Dirección', '<input class="form-control" name="direccion">'));
        }
        echo '</tr>';
    }
    echo '</tbody></table>' . $modales;
}
