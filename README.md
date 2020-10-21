# MoonAssignment

## Technologies Used

  * Express.js
  * Node.js
  * MongoDB
  * Mongoose

## API Endpoints
### `users`
* `POST /api/users/register` - Register
* `POST /api/users/login` - Login
* `GET /api/users/current` - Returns current user logged in with given authentication token
### `book`
* `GET /api/books/` - Returns list of all books
* `GET /api/books/:id` - Returns a book with given id
### `review`
* `POST /api/reviews/`  - Creates a review
* `PATCH /api/reviews/:id`  - Edit a review
* `DELETE /api/reviews/:id`  - Delete a review

---

## Setup
Clone this repo to your desktop and run `npm install` to install all the dependencies.

## Usage
After you clone this repo to your desktop and install all the dependencies, you can run `npm run server` from the command line to run the server locally on port 5000. After running the server you can test the API endpoints using an API development platform like Postman.

---

