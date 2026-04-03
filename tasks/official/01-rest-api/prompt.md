# Task: Add PATCH Endpoint to REST API

You have an Express REST API with `GET /users`, `GET /users/:id`, `POST /users`, and `DELETE /users/:id` endpoints.

**Your task:** Add a `PATCH /users/:id` endpoint that supports partial updates.

## Requirements

1. Accept a JSON body with any subset of user fields (`name`, `email`, `age`)
2. Only update the fields that are provided in the request body
3. If `email` is being changed, validate that no other user already has that email. Return `400` with `{ "error": "Email already exists" }` if duplicate
4. Return `404` with `{ "error": "User not found" }` if the user ID doesn't exist
5. Return `400` with `{ "error": "No valid fields to update" }` if the body contains no valid fields
6. Return `200` with the updated user object on success
7. Add tests for all the above cases

Do NOT modify existing endpoints. Only add the PATCH endpoint and its tests.
