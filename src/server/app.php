<?php

$router
  ->views(__DIR__ . '/../views')
  ->serve(__DIR__ . '/../public')
  ->apply(require 'middleware/json-body.php');

require_once 'api/index.php';

$router->get('/(index|app|home)?(\.)?([a-zA-Z]{3,})?', function ($request, $response) {
  $todo = json_decode(file_get_contents($request->baseURL . 'api/item/read'));
  $response->render('app.php', [ 'todo' => $todo ]);
});
