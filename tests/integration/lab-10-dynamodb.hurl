# 1. Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
`{ "service": "DynamoDB" }`

HTTP/1.1 201
[Asserts]
# Check if Location header is returned and correctly formatted
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
# Check the fragment ID is a valid UUID
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# Check the ownerId is a valid hex string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Check created and updated timestamps are strings
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
# Check the fragment type matches JSON
jsonpath "$.fragment.type" == "application/json"

[Captures]
# Capture the fragment URL and ID for later use
url: header "Location"
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

# 2. Try to GET the fragment we just created using its URL
GET {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
# Check the fragment details match the created fragment
jsonpath "$.fragment.id" == {{fragment1_id}}
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString

# 3. Authenticated POST to /v1/fragments with Markdown
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`DynamoDB is **great**.`

HTTP/1.1 201
[Asserts]
# Check if Location header is returned and correctly formatted
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
# Check the fragment ID is a valid UUID
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# Check the ownerId is a valid hex string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Check created and updated timestamps are strings
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
# Check the fragment type matches Markdown
jsonpath "$.fragment.type" == "text/markdown"

[Captures]
# Capture the fragment URL and ID for later use
url: header "Location"
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# 4. Try to GET the Markdown fragment info
GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
# Check the fragment details match the created fragment
jsonpath "$.fragment.id" == {{fragment2_id}}
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"

# 5. Get all unexpanded fragments for the authorized user
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
# Ensure both fragment IDs are present in the list
jsonpath "$.fragments[*]" includes {{fragment1_id}}
jsonpath "$.fragments[*]" includes {{fragment2_id}}

# 6. DELETE the first fragment
DELETE {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

# 7. Try to GET the first fragment (deleted)
GET {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404

# 8. Get all unexpanded fragments again for the authorized user
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
# Ensure the deleted fragment is no longer in the list
jsonpath "$.fragments[*]" != {{fragment1_id}}
# Ensure the second fragment is still present
jsonpath "$.fragments[*]" includes {{fragment2_id}}
