<?php

$router
  # content
  ->patch('/api/item/update/:itemId([0-9a-z\-]{36})/content', function ($request, $response) use (&$db) {

    if (gettype($request->body) !== 'object')
      return $response->status(400)->json(['error' => 'invalid request']);

    $content = isset($request->body->content) ? trim(strval($request->body->content)) : '';

    if (strlen($content) < 1) return $response->json(['error' => 'no content']);

    $itemId = $request->params['itemId'];

    try {
      $statement = $db->prepare('update `item` set `content` = :content where `itemId` = :itemId');
      $statement->bindParam('content', $content, PDO::PARAM_STR);
      $statement->bindParam('itemId', $itemId, PDO::PARAM_STR);
      $statement->execute();
      $document = $db->query('select * from `item` where `itemId` = "' . $itemId . '"; limit 1')->fetch(PDO::FETCH_OBJ);
      $error = boolval($document) ? null : 'not found';
      $response->json(['error' => $error, 'document' => $document]);
    } catch (PDOException $e) {
      $response->status(500)->json(['error' => $e->getMessage()]);
    }
  })
  # status
  ->patch('/api/item/update/:itemId([0-9a-z\-]{36})/status', function ($request, $response) use (&$db) {
    if (gettype($request->body) !== 'object')
      return $response->status(400)->json(['error' => 'invalid request']);

    if (!isset($request->body->is_done) || gettype($request->body->is_done) !== 'boolean') 
      return $response->status(400)->json(['error' => 'invalid request']);

    $isDone = intval($request->body->is_done);
    $itemId = $request->params['itemId'];

    try {
      $statement = $db->prepare('update `item` set `isDone` = :is_done where `itemId` = :itemId');
      $statement->bindParam('is_done', $isDone, PDO::PARAM_INT);
      $statement->bindParam('itemId', $itemId, PDO::PARAM_STR);
      $statement->execute();
      $document = $db->query('select * from `item` where `itemId` = "' . $itemId . '"; limit 1')->fetch(PDO::FETCH_OBJ);
      $error = boolval($document) ? null : 'not found';
      $response->json(['error' => $error, 'document' => $document]);
    } catch (PDOException $e) {
      $response->status(500)->json(['error' => $e->getMessage()]);
    }
  });