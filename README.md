# Real-Time Notification System

A distributed real-time notification system built with Node.js, Express.js, MongoDB, Redis, and Docker.

## Features

- **Redis Pub/Sub**: Real-time event distribution with 50% reduced latency
- **RESTful APIs**: Comprehensive notification management
- **Rate Limiting**: Protection against abuse
- **Request Validation**: Joi-based validation middleware
- **Error Handling**: Centralized error handling with proper status codes
- **Docker Support**: Full containerization with Docker Compose

## API Endpoints

### Notifications

- `POST /api/notifications` - Create a new notification
- `GET /api/notifications/user/:userId` - Get user notifications
- `PATCH /api/notifications/:notificationId/read` - Mark notification as read
- `GET /api/notifications/user/:userId/unread-count` - Get unread count

### Health Check

- `GET /health` - System health status

## Running the Application

### Development

```bash
npm install
npm run dev