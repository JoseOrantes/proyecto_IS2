<?php

declare(strict_types=1);

require_once __DIR__ . '/../../services/prospectos_request.php';

function renderProspectos(string $token, bool $esAdmin = false): void
{
    $respuesta = listarProspectos($token);
    echo '<h1>Prospectos</h1>';

    echo '<section class="tarjeta"><h2>Nuevo prospecto</h2>
        <form method="post" action="index.php?page=prospectos" class="formulario">
            <input type="hidden" name="accion" value="crear_prospecto">
            <label>Nombre <input name="nombre" required></label>
            <label>Teléfono <input name="telefono"></label>
            <label>Correo <input type="email" name="email"></label>
            <label>Fuente <input name="fuente" placeholder="Redes, referido, showroom"></label>
            <button type="submit">Guardar</button>
        </form></section>';

    if (!exito($respuesta)) {
        echo '<p class="alerta error">' . e(mensajeError($respuesta)) . '</p>';
        return;
    }

    echo '<table><thead><tr><th>Nombre</th><th>Fuente</th><th>Estado</th><th>Convertir a cliente</th>' . ($esAdmin ? '<th></th>' : '') . '</tr></thead><tbody>';
    $modales = '';
    foreach ($respuesta['data'] as $prospecto) {
        echo '<tr><td>' . e($prospecto['nombre']) . '</td><td>' . e($prospecto['fuente']) . '</td><td>'
            . e($prospecto['estado']) . '</td><td>';
        if ($prospecto['estado'] !== 'Convertido') {
            echo '<form method="post" action="index.php?page=prospectos" class="en-linea" data-confirm="¿Convertir este prospecto en cliente?">
                <input type="hidden" name="accion" value="convertir_prospecto">
                <input type="hidden" name="id" value="' . e($prospecto['id']) . '">
                <input name="nit" placeholder="NIT" required>
                <button type="submit">Convertir</button>
            </form>';
        }
        echo '</td>';
        if ($esAdmin) {
            $modalId = 'modalProspecto' . $prospecto['id'];
            echo '<td class="d-flex gap-2 flex-nowrap">';
            if ($prospecto['estado'] !== 'Convertido') {
                echo botonEditar($modalId, $prospecto);
                $modales .= modalEditar($modalId, 'Editar prospecto', 'prospectos', 'actualizar_prospecto',
                    campoFormulario('Nombre', '<input class="form-control" name="nombre" required>')
                    . campoFormulario('Teléfono', '<input class="form-control" name="telefono">')
                    . campoFormulario('Correo', '<input class="form-control" type="email" name="email">')
                    . campoFormulario('Fuente', '<input class="form-control" name="fuente">')
                    . campoFormulario('Estado', '<select class="form-select" name="estado">'
                        . '<option>Nuevo</option><option>Contactado</option><option>Calificado</option><option>Descartado</option>'
                        . '</select>'));
            }
            echo formularioEliminar('prospectos', 'eliminar_prospecto', $prospecto['id'], '¿Eliminar el prospecto ' . $prospecto['nombre'] . '? Esta acción no se puede deshacer.') . '</td>';
        }
        echo '</tr>';
    }
    echo '</tbody></table>' . $modales;
}
