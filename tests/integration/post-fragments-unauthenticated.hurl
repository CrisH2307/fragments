POST http://localhost:8080/v1/fragments
Content-Type: application/json
# No authentication header should be included, or use invalid credentials

{"message": "Unauthenticated fragment"}

HTTP/1.1 401
[Asserts]
jsonpath "$.error.message" == "Unauthorized"