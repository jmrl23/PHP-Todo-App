<?php

$router
  # single document
  ->get('/api/item/read/:itemId([0-9a-z\-]{36})', function ($request, $response) use (&$db) {

    $itemId = $request->params['itemId'];

    try {
      $document = $db->query('select * from `item` where `itemid` = "' . $itemId . '" limit 1')->fetch(PDO::FETCH_OBJ);
      $response->json(['error' => null, 'document' => $document]);
    } catch (PDOException $e) {
      return $response->status(500)->json(['error' => $e->getMessage()]);
    }

  })
  # all document
  ->get('/api/item/read', function ($request, $response) use (&$db) {

    try {
      $documents = $db->query('select * from `item`')->fetchAll(PDO::FETCH_OBJ);
      $response->json(['error' => null, 'documents' => $documents]);
    } catch (PDOException $e) {
      return $response->status(500)->json(['error' => $e->getMessage()]);
    }

  });