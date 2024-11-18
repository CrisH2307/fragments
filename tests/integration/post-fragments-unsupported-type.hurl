POST http://localhost:8080/v1/fragments
Content-Type: application/xml
[BasicAuth]
user1@email.com:password1

<data>This is an unsupported type</data>

HTTP/1.1 415
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.message" == "Not a valid type"