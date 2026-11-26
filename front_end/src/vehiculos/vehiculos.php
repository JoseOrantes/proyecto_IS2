<?php

declare(strict_types=1);

require_once __DIR__ . '/../../services/vehiculos_inventory.php';

function renderVehiculos(string $token, bool $esAdmin = false): void
{
    $respuesta = listarVehiculos($token);
    $tipos = listarTiposVehiculo($token);
    echo '<h1>Catálogo de vehículos</h1>';

    echo '<section class="tarjeta"><h2>Registrar vehículo</h2>
        <form method="post" action="index.php?page=vehiculos" class="formulario">
            <input type="hidden" name="accion" value="crear_vehiculo">
            ' . camposVehiculo($tipos['data'] ?? []) . '
            <button type="submit" class="btn btn-primary">Guardar</button>
        </form></section>';

    if (!exito($respuesta)) {
        echo '<p class="alerta error">' . e(mensajeError($respuesta)) . '</p>';
        return;
    }

    echo '<div class="catalogo">';
    $modales = '';
    foreach ($respuesta['data'] as $vehiculo) {
        echo '<article class="tarjeta vehiculo">'
            . ($vehiculo['imagen'] ? '<img src="' . e($vehiculo['imagen']) . '" alt="' . e($vehiculo['tipo']) . '">' : '') . '
            <h2>' . e($vehiculo['tipo']) . '</h2>
            <p><strong>' . e($vehiculo['marca']) . ' ' . e($vehiculo['modelo']) . '</strong> (' . e($vehiculo['anio']) . ')</p>
            <p>' . e($vehiculo['descripcion']) . '</p>
            <p>Precio: ' . e(moneda($vehiculo['precio'])) . ' · Stock: ' . e($vehiculo['stock']) . '</p>';
        if ($esAdmin) {
            $modalId = 'modalVehiculo' . $vehiculo['id'];
            echo '<div class="d-flex gap-2 flex-nowrap">' . botonEditar($modalId, $vehiculo)
                . formularioEliminar('vehiculos', 'eliminar_vehiculo', $vehiculo['id'], '¿Eliminar el ' . $vehiculo['tipo'] . ' ' . $vehiculo['modelo'] . '? Esta acción no se puede deshacer.') . '</div>';
            $modales .= modalEditar($modalId, 'Editar vehículo', 'vehiculos', 'actualizar_vehiculo', camposVehiculo($tipos['data'] ?? []));
        }
        echo '</article>';
    }
    echo '</div>' . $modales;
}

function camposVehiculo(array $tipos): string
{
    $opciones = '';
    foreach ($tipos as $tipo) {
        $opciones .= '<option value="' . e($tipo['id']) . '">' . e($tipo['nombre']) . '</option>';
    }
    return campoFormulario('Tipo', '<select class="form-select" name="tipo_id" required>' . $opciones . '</select>')
        . campoFormulario('Marca', '<input class="form-control" name="marca" required>')
        . campoFormulario('Modelo', '<input class="form-control" name="modelo" required>')
        . campoFormulario('Año', '<input class="form-control" type="number" name="anio" min="1900" max="2100" required>')
        . campoFormulario('Precio (Q)', '<input class="form-control" type="number" name="precio" min="0" step="0.01" required>')
        . campoFormulario('Stock', '<input class="form-control" type="number" name="stock" min="0" step="1" required>')
        . campoFormulario('Descripción', '<textarea class="form-control" name="descripcion" rows="2"></textarea>')
        . campoFormulario('Ruta de imagen (opcional)', '<input class="form-control" name="imagen" placeholder="imagenes_vehiculos/archivo.png">');
}
