# Restaurant Management System

## Overview

This project is a restaurant management system built with NestJS, MongoDB, and Redis. It includes features for managing orders, products, and generating daily sales reports with caching to improve performance.

## Prerequisites

- Node.js (version 20.x or higher)
- MongoDB
- Redis
- Docker (optional, for containerization)

## Installation Steps

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
https://github.com/Mohammed3tef/restaurant_management_system.git
cd restaurant-management-system
```

### 2. Install Project Dependencies

Install the required Node.js dependencies:

```bash
npm install
```

### 3. Configure Environment Variables

Create a .env file from env-example the root directory of your project and edit the following environment variables:

```bash
MONGODB_URI=mongodb://localhost:27017/your_database_name
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Run the Application Locally

To start the application locally:

```bash
npm start
```

### 4. Build and Run the Application with Docker

If you want to use Docker to build and run the application, follow these steps:

#### 1. Build and Start Containers

Run the following command to build and start the application along with its dependencies:

```bash
docker-compose up --build
```

#### 2. Stop and Remove Containers

To stop and remove all containers defined in docker-compose.yml, use:

```bash
docker-compose down
```

### API Collection

An API collection has been added to the application, allowing you to easily import and test the available endpoints. You can import this collection into Postman or any other API testing tool and start using it right away.

#### Importing the API Collection

##### 1. Locate the restaurantmanagementsystem.postman_collection.json file added to the application.

##### 2. Import the file into your preferred API client (e.g., Postman).

##### 3. The collection includes endpoints for managing customers, products, orders, and generating daily sales reports, providing a comprehensive set of tools to interact with the system's API.

### Endpoints Included

- **Customers**: Endpoints for creating, updating and retrieving data.
- **Products**: Endpoints for managing product inventory, including adding, updating and retrieving products.
- **Orders**: Endpoints for handling orders, from creation, updating and retrieving Orders.
- **Daily Reports**: Endpoints for generating and retrieving daily sales reports.

This collection will make it easier to test and explore the various functionalities of the system's API.

### Screenshots

[![Screenshot-from-2024-08-09-11-01-35.png](https://i.postimg.cc/GpFyDF1w/Screenshot-from-2024-08-09-11-01-35.png)](https://postimg.cc/jWj20J5Z)
[![Screenshot-from-2024-08-09-11-01-41.png](https://i.postimg.cc/1tTs5dY9/Screenshot-from-2024-08-09-11-01-41.png)](https://postimg.cc/phDgssH7)
[![Screenshot-from-2024-08-09-11-01-49.png](https://i.postimg.cc/SNnYdFpG/Screenshot-from-2024-08-09-11-01-49.png)](https://postimg.cc/rKLpyHsd)
[![Screenshot-from-2024-08-09-11-01-55.png](https://i.postimg.cc/v8kZQ4pW/Screenshot-from-2024-08-09-11-01-55.png)](https://postimg.cc/0rGsny5Q)
[![Screenshot-from-2024-08-09-11-02-06.png](https://i.postimg.cc/zX4bPtzY/Screenshot-from-2024-08-09-11-02-06.png)](https://postimg.cc/8jBz7bfZ)
