<?php

class DB {

  private static $serverName = 'localhost';
  private static $dbName     = 'todo';
  private static $username   = 'root';
  private static $password   = 'jojomariel312';
  private static $connection = NULL;
  
  public static function conn() : PDO {
    if (self::$connection) return self::$connection;

    try {
      $connection = new PDO('mysql:host=' . self::$serverName . ';dbname=' . self::$dbName, self::$username, self::$password);
      self::$connection = $connection;
      return self::conn();
    } catch (PDOException $e) {
      header('Content-Type: application/json; charset=UTF-8');
      http_response_code(500);
      echo json_encode((object) ['error' => $e->getMessage()]);
      exit;
    }
  } 
}