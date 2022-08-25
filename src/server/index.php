<?php

require_once __DIR__ . '/../../.router/mod.php';
require_once __DIR__ . '/database.php';

$router = new Router\Router();

$db = DB::conn();

require_once 'app.php';

$router->activate();