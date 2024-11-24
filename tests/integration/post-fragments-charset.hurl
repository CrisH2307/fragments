POST http://localhost:8080/v1/fragments
Content-Type: text/plain; charset=utf-8
[BasicAuth]
user1@email.com:password1

# Separate headers from the body with a blank line
`This is a text fragment with charset`

HTTP/1.1 201
[Asserts]
jsonpath "$.fragment.type" == "text/plain; charset=utf-8"
