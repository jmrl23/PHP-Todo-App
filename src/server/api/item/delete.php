<?php

$router->delete('/api/item/delete/:itemId([0-9a-z\-]{36})', function ($request, $response) use (&$db) {
  
  $itemId = $request->params['itemId'];
  try {
    $db->query('delete from `item` where `itemId` = "' . $itemId . '" limit 1');
    $response->json(['error' => null]);
  } catch (PDOException $e) {
    $response->status(500)->json(['error' => $e->getMessage()]);
  }

});