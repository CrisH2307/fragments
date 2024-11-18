# 404 Not Found Test
GET http://localhost:8080/no-such-route

# We expect to get back an HTTP 1.1 404 response
HTTP/1.1 404

[Asserts]
# Check that the status in the JSON response is "error"
jsonpath "$.status" == "error"

# Check that the error code is 404
jsonpath "$.error.code" == 404

# Check that the error message is "not found"
jsonpath "$.error.message" == "not found"
