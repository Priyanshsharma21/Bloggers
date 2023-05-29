# Technetium - Backend Cohort Repository

Welcome to the Technetium repository for the backend cohort! This repository contains the code for the Blogging Site Mini Project. The project is divided into two phases and includes models, APIs, authentication, authorization, and testing.

## Phase I

### Models

- **Author Model:**
  - `fname` (mandatory)
  - `lname` (mandatory)
  - `title` (mandatory, enum [Mr, Mrs, Miss])
  - `email` (mandatory, valid email, unique)
  - `password` (mandatory)

- **Blogs Model:**
  - `title` (mandatory)
  - `body` (mandatory)
  - `authorId` (mandatory, references author model)
  - `tags` (array of strings)
  - `category` (string, mandatory)
  - `subcategory` (array of strings, e.g., [technology-[web development, mobile development, AI, ML, etc]])
  - `createdAt`, `updatedAt`, `deletedAt` (when the document is deleted)
  - `isDeleted` (boolean, default: false)
  - `publishedAt` (when the blog is published)
  - `isPublished` (boolean, default: false)

### Author APIs

- `POST /authors`: Create an author - at least 5 authors
- `POST /blogs`: Create a blog document from the request body. Get `authorId` in the request body only.
- `GET /blogs`: Returns all blogs in the collection that aren't deleted and are published. Supports filters by author ID, category, and list of tags.
- `PUT /blogs/:blogId`: Updates a blog by changing its title, body, adding tags, adding a subcategory, or changing its publish status.
- `DELETE /blogs/:blogId`: Marks a blog as deleted.
- `DELETE /blogs?queryParams`: Deletes blog documents based on query parameters.

## Phase II

### Authentication and Authorization

- `POST /login`: Allows an author to login with their email and password. Returns a JWT token containing the authorId.
- Authentication: Validates the JWT token before calling protected endpoints. Protects routes for creating a blog, editing a blog, getting the list of blogs, and deleting a blog(s).
- Authorization: Only the owner of the blogs can edit or delete them.

### Testing (Self-evaluation During Development)

- Postman collection: Use the provided Postman collection named "Project 1 Blogging" for testing.
- Each API should have a corresponding request in the collection.
- Collections and requests should be appropriately named.
- Each team member should have their tests in a running state.

## Response Structures

- Successful Response:
{
"status": true,
"data": { ... }
}



- Error Response:
{
"status": false,
"message": "..."
}



## Collections

**Author:**
{
"status": true,
"data": {
"_id": "63edd170875e5650d89ab9b8",
"fname": "John",
"lname": "Wick",
"title": "Mr",
"email": "john4614@gmail.com",
"password": "pass1234",
"createdAt": "2023-02-16T06:47:12.993Z",
"updatedAt": "2023-02-16T06:47:12.993Z",
"__v": 0
}
}



**Blogs:**
{
"status": true,
"data": {
"title": "How to win friends",
"body": "Blog body",
"tags": ["Book", "Friends", "Self help"],
"category": "Book",
"subcategory": ["Non fiction", "Self Help"],
"published": false,
"publishedAt": "",
"deleted": false,
"deletedAt": "",
"createdAt": "2021-09-17T04:25:07.803Z",
"updatedAt": "2021-09-17T04:25:07.803Z"
}
}



**Get Blogs Response Structure:**
{
"status": true,
"message": "Blogs list",
"data": [
{ ... },
{ ... }
]
}



**Updated Blog Response Structure:**
{
"status": true,
"message": "Blog updated successfully",
"data": { ... }
}


**Delete Blog Response Structure:**
{
"status": true,
"message": ""
}



**Successful Login Response Structure:**
{
"status": true,
"data": {
"token": "..."
}
}
