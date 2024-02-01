# NestJS Application Overview

The provided application is a NestJS-based API designed for managing user-related operations and book entities. The key features include user sign-up, sign-in, and book management functionalities such as creating, reading, updating, and deleting books. The code structure adheres to NestJS conventions, employing separate modules for users and books, along with associated services, controllers, and entities.

## Technologies Used

- **TypeScript:** The application is developed using TypeScript, offering strong typing and improved developer experience.
- **TypeORM:** TypeORM is utilized for database interactions, providing a seamless connection between the application and the database.
- **JWT Authentication:** JSON Web Tokens (JWT) are employed for authentication purposes, ensuring secure user sign-in functionality.
- **Custom Response Classes:** Custom response classes, including `CustomResponse`, `SuccessResponse`, and `ErrorResponse`, are implemented to provide standardized error and success responses.

## How to Run and Test the Application

Follow these steps to run and test the NestJS application:

### Install Dependencies

### . Assumptions

- You have mysql server installed and setup on your local machine. or to run it on Docker, Docker and Docker Compose are installed on the host machine.

### 4. Uncovered Requirements

No requirements have been left uncovered.

### 5. Source Code Configuration

1. Clone the repository:

   ```bash
   git clone <https://github.com/znuta/book-api.git>
   ```

# Navigate to the project directory:

cd book-api

# Create a .env file in the project root and configure necessary environment variables.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

The application will be running on http://localhost:3000 by default.

API Endpoints
Explore the API endpoints available under /users and /books routes as indicated by the controllers. Refer to API documentation or code for details on available endpoints.

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

Set Up Environment Variables
Create a .env file at the project root with necessary environment variables, such as database connection details.

Database Setup
Ensure the database is set up and running. For TypeORM, run migrations to create tables based on entities.

Postman or Swagger
Utilize tools like Postman or Swagger to interact with the API. Test each endpoint's functionality and observe responses.

Custom Response Handling
Verify the correct implementation and usage of custom responses (CustomResponse, SuccessResponse, ErrorResponse) throughout the application. Ensure error and success responses adhere to defined structures.

Environment Variables in Production
In a production environment, securely set environment variables using a suitable method, such as through the hosting platform or a configuration file.

# Build and run the Docker containers.

docker-compose up --build
