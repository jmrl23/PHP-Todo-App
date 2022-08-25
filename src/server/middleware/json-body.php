<?php

return function ($request, $response, $next) {
  if (!isset($request->headers['Content-Type'])) return $next();
  $contentType = strtolower(strval($request->headers['Content-Type']));
  if (!str_starts_with($contentType, 'application/json')) return $next();
  $requestBody = json_decode($request->body);
  $request->body = (object) [];
  if (json_last_error() !== JSON_ERROR_NONE) return $next();
  $request->body = $requestBody;
  $next();
};