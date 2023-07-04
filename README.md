# Hexaplace API

This is a TypeScript/NestJS project that demonstrates the implementation of Hexagonal architecture using an e-commerce use case. This application provides a set of APIs for managing an e-commerce platform.

## Table of Contents

- [Hexaplace API](#hexaplace-api)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [DB migration](#db-migration)
  - [Testing](#testing)
  - [Code Coverage](#code-coverage)
  - [Swagger Documentation](#swagger-documentation)

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (version >= 16.3.1)
- Docker (for running PostgreSQL)

## Installation

1. Clone the repository:

```shell
git clone git@github.com:Hazem-Ben-Khalfallah/hexaplace.git
```

2. Navigate to the project directory:

```shell
cd hexaplace
```

3. Install the dependencies:

```shell
npm install
```

## Usage

To start the PostgreSQL Docker container, use the following command:

```shell
npm run docker:up
```

To stop the PostgreSQL Docker container, use the following command:

```shell
npm run docker:down
```

To start the application, use the following command:

```shell
npm run start
```

After starting the application, you can access the Swagger documentation by opening the following URL in your browser:

```
http://localhost:3000/docs
```

## DB migration

To create the need database and its related tables, use the following command:

```shell
npm run migration:up
```

## Testing

To execute unit tests only, use the following command:

```shell
npm run test:unit
```

To execute end-to-end (e2e) tests only, use the following command:

```shell
npm run test:e2e
```

To run all tests, including unit and e2e tests, use the following command:

```shell
npm run test:all
```

## Code Coverage

To check the code coverage report from unit tests, use the following command:

```shell
npm run test:unit:cov
```
the generated reports will found under `./coverage/unit`

To check the code coverage report for all tests, including unit and e2e tests, use the following command:

```shell
npm run test:all:cov
```
the generated reports will found under `./coverage/all`

## Swagger Documentation

After starting the application, you can access the Swagger documentation by opening the following URL in your browser:

```
http://localhost:3000/docs
```

The Swagger documentation provides detailed information about the available APIs and their usage.

Feel free to explore and use the Hexaplace API for your e-commerce needs!