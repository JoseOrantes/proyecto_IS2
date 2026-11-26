<?php

declare(strict_types=1);

function renderLogin(?string $error = null): void
{
    ?>
    <section class="tarjeta login"<?= $error !== null ? ' data-login-error' : '' ?>>
        <h1>AutoVentas GT</h1>
        <p>Inicie sesión para continuar.</p>
        <?php if ($error !== null): ?>
            <p class="alerta error"><?= e($error) ?></p>
        <?php endif; ?>
        <form method="post" action="index.php">
            <input type="hidden" name="accion" value="login">
            <label>Correo <input type="email" name="email" required></label>
            <label>Contraseña <input type="password" name="password" required></label>
            <button type="submit">Ingresar</button>
        </form>
    </section>
    <?php
}
