(function () {
    'use strict';

    /* Confirmaciones con el modal de Bootstrap: formularios y enlaces con data-confirm. */
    var modalElemento = document.getElementById('modalConfirmacion');
    var modal = modalElemento ? new bootstrap.Modal(modalElemento) : null;
    var mensajeModal = document.getElementById('modalConfirmacionMensaje');
    var botonAceptar = document.getElementById('modalConfirmacionAceptar');
    var accionPendiente = null;

    function confirmar(mensaje, accion) {
        mensajeModal.textContent = mensaje;
        accionPendiente = accion;
        modal.show();
    }

    botonAceptar.addEventListener('click', function () {
        var accion = accionPendiente;
        accionPendiente = null;
        modal.hide();
        if (accion) {
            accion();
        }
    });

    /* form.submit() no dispara el evento submit, así que no hay bucle. */
    document.addEventListener('submit', function (evento) {
        var formulario = evento.target;
        if (!formulario.dataset.confirm) {
            return;
        }
        evento.preventDefault();
        confirmar(formulario.dataset.confirm, function () {
            formulario.submit();
        });
    });

    document.addEventListener('click', function (evento) {
        var enlace = evento.target.closest('a[data-confirm]');
        if (!enlace) {
            return;
        }
        evento.preventDefault();
        confirmar(enlace.dataset.confirm, function () {
            window.location.href = enlace.href;
        });
    });

    /* Botones Editar: cargan los valores actuales en el modal de edición de su fila. */
    document.addEventListener('click', function (evento) {
        var boton = evento.target.closest('[data-editar]');
        if (!boton) {
            return;
        }
        var modalEdicion = document.querySelector(boton.dataset.modal);
        var valores = JSON.parse(boton.dataset.valores || '{}');
        Object.keys(valores).forEach(function (nombre) {
            modalEdicion.querySelectorAll('[name="' + nombre + '"]').forEach(function (campo) {
                if (campo.type === 'checkbox') {
                    campo.checked = Boolean(valores[nombre]);
                } else {
                    campo.value = valores[nombre] == null ? '' : String(valores[nombre]);
                }
            });
        });
        bootstrap.Modal.getOrCreateInstance(modalEdicion).show();
    });

    /* Credenciales incorrectas: sacudir la tarjeta, limpiar la contraseña y devolver el foco. */
    function retroalimentarErrorLogin(tarjeta) {
        var password = tarjeta.querySelector('input[name="password"]');
        tarjeta.classList.add('sacudir');
        if (password) {
            password.value = '';
            password.focus();
        }
    }

    /* Mensajes de éxito que se ocultan solos tras unos segundos. */
    function ocultarMensajesExito() {
        document.querySelectorAll('.alerta.exito').forEach(function (alerta) {
            window.setTimeout(function () {
                alerta.classList.add('oculta');
                window.setTimeout(function () {
                    alerta.remove();
                }, 500);
            }, 4000);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var tarjetaLogin = document.querySelector('[data-login-error]');
        if (tarjetaLogin) {
            retroalimentarErrorLogin(tarjetaLogin);
        }
        ocultarMensajesExito();
    });
})();
