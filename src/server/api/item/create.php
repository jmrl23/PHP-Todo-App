<?php

$router->post('/api/item/create', function ($request, $response) use (&$db) {

  if (gettype($request->body) !== 'object')
    return $response->status(400)->json(['error' => 'invalid request']);

  $content = isset($request->body->content) ? trim(strval($request->body->content)) : '';

  if (strlen($content) < 1) return $response->json(['error' => 'no content']);

  try {
    $itemId = $db->query('select uuid() as `itemId`')->fetch(PDO::FETCH_OBJ)->itemId;
    $statement = $db->prepare('insert into `item` (`itemId`, `content`) values (:itemId, :content)');
    $statement->bindParam('itemId', $itemId, PDO::PARAM_STR);
    $statement->bindParam('content', $content, PDO::PARAM_STR);
    $statement->execute();
    $response->json([
      'error' => null, 
      'document' => $db->query('select * from `item` where `itemId` = "' . $itemId . '" limit 1')
                       ->fetch(PDO::FETCH_OBJ)
    ]);
  } catch (PDOException $e) {
    $response->status(500)->json(['error' => $e->getMessage()]);
  }

});