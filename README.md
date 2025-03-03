# NestJS User API

This project is a NestJS-based GraphQL API for managing users. It includes authentication and user management functionalities.

## Features

- **GraphQL API**: Provides a GraphQL interface for interacting with the API.
- **Authentication**: Includes JWT-based authentication.
- **User Management**: Allows for creating, reading, updating, and deleting users.
- **TypeORM**: Uses TypeORM for database interactions.
- **Validation**: Uses class-validator for input validation.

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)
- PostgreSQL


### Installation

#### With Docker Compose (Recommended)

1. Clone the repository:
```bash
    git clone https://github.com/your-username/test-stibodx.git
    cd test-stibodx
```

2. Run Docker Compose
```bash
    docker-compose up
```

#### Installation dafault

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/test-stibodx.git
    cd test-stibodx/server
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your database configuration:
    ```env
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    DATABASE_USER=your_db_user
    DATABASE_PASSWORD=your_db_password
    DATABASE_NAME=your_db_name
    JWT_SECRET=your_jwt_secret
    ```

### Running the Application

1. Run the database migrations:
    ```bash
    npm run migration:run
    ```

> **Note**: Note: If you are in a development environment, you can set `synchronize: true` in `./src/config/data-source.ts` to synchronize changes made to the database table structure, it should not be used in production. This first migration will create the `user` table and create a user admin with email equal `admin@admin.com` and `admin1234` password. 

2. Start the application in development mode:
    ```bash
    npm run start:dev
    ```

3. The application will be running at `http://localhost:3000`.

### GraphQL Playground

You can access the GraphQL Playground to interact with the API and test queries and mutations at the following endpoint:

```
http://localhost:3000/graphql
```

The GraphQL Playground provides an interactive interface for exploring the API schema, running queries, and viewing the results in real-time.



### Running Tests

To run the tests, use the following command:
```bash
npm run test
```

## Functionalities

### Authentication and Authorization

The API uses JWT-based authentication to secure endpoints. Users must be authenticated to access certain functionalities. The following guards are used to enforce authorization:

- **AuthGuard**: Ensures that the user is authenticated.
- **AdminGuard**: Ensures that the user has admin privileges.

### User Management

The API provides the following user management functionalities:

- **Create User**: Allows creating a new user. No authentication is required.
- **Update User**: Allows updating an existing user. Requires the user to be authenticated.
- **Delete User**: Allows deleting a user. Requires the user to be authenticated and have admin privileges.
- **Get All Users**: Allows retrieving a list of all users. Requires the user to be authenticated and have admin privileges.
- **Get User by ID**: Allows retrieving a user by their ID. No authentication is required.

### Authorization and Permission Restrictions

- **Deleting a User**: Only users with admin privileges can delete a user. This is enforced using the `AdminGuard` in combination with the `AuthGuard`.
- **Updating a User**: Any authenticated user can update their data. This is enforced using the `AuthGuard`.
- **Retrieving All Users**: Only users with admin privileges can retrieve the list of all users. This is enforced using the `AdminGuard` in combination with the `AuthGuard`.

### Field Restrictions

Certain fields in the User entity have restrictions based on user roles. These restrictions are enforced using middleware and extensions:

- **ID**: Only users with admin privileges can access the `id` field. This is enforced using the `checkRoleMiddleware` and the `@Extensions` decorator with `Roles.ADMIN`.
- **Email**: Only users with admin privileges can access the `email` field. This is enforced using the `checkRoleMiddleware` and the `@Extensions` decorator with `Roles.ADMIN`.
- **Role**: Only users with admin privileges can access the `role` field. This is enforced using the `checkRoleMiddleware`.
