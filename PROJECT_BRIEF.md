# PriceWatch

## Project Overview

PriceWatch is a cloud-native retail intelligence platform designed to demonstrate modern software engineering practices and technologies commonly requested in graduate and junior software engineering roles.

The platform allows users to track products across multiple online retailers, monitor historical pricing trends, compare prices, create watchlists, and receive automated notifications when products reach a desired price.

This project is intended as a portfolio-quality software engineering project rather than a simple CRUD application.

---

## Primary Objectives

Demonstrate experience with:

* TypeScript
* Node.js
* NestJS
* React
* PostgreSQL
* Redis
* RabbitMQ
* Docker
* Docker Compose
* GitHub Actions
* REST APIs
* Microservices
* AWS deployment
* Automated testing
* Team collaboration
* Documentation

---

## Target Audience

This project is being built as a portfolio piece for:

* Graduate Software Engineer roles
* Junior Full Stack Developer roles
* Junior Backend Developer roles
* Cloud Engineering roles
* Software Engineering roles involving distributed systems

---

## Core Features

### User Accounts

* Registration
* Login
* Authentication
* Profile management

### Product Tracking

* Search products
* View product information
* Compare retailers
* Track pricing history

### Watchlists

* Save products
* Monitor selected items
* Manage tracking preferences

### Alerts

* Configure target prices
* Receive notifications when prices fall below thresholds

### Analytics

* Historical pricing trends
* Retailer comparisons
* Product insights

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite

### Backend

* Node.js
* NestJS
* TypeScript

### Database

* PostgreSQL

### Cache

* Redis

### Messaging

* RabbitMQ

### Infrastructure

* Docker
* Docker Compose

### CI/CD

* GitHub Actions

### Cloud

Future deployment target:

* AWS ECS
* AWS RDS
* AWS S3
* AWS CloudWatch

---

## Architecture

The system will evolve into a microservice architecture.

Planned services:

* web
* api-gateway
* user-service
* product-service
* price-service
* alert-service
* notification-service
* scraper-service

Services should communicate through APIs and asynchronous messaging where appropriate.

---

## Development Philosophy

* Build incrementally.
* Start with a working baseline.
* Avoid premature complexity.
* Prioritise maintainability.
* Prioritise documentation.
* Prioritise testing.
* Keep services loosely coupled.
* Prefer clear code over clever code.

---

## Iteration 1 Goal

Create a working foundation consisting of:

* Monorepo structure
* React frontend
* NestJS API gateway
* Docker Compose
* PostgreSQL container
* Redis container
* RabbitMQ container
* Health endpoint
* README
* GitHub Actions CI workflow

No business features should be implemented during Iteration 1.

The objective is simply to create a stable development foundation.

---

## Definition of Done for Iteration 1

The following command should start the complete local environment:

docker compose up

Success criteria:

* Frontend loads
* API gateway loads
* Health endpoint returns success
* PostgreSQL is accessible
* Redis is accessible
* RabbitMQ is accessible
* CI pipeline executes successfully

---

## Environment

Development environment:

* Ubuntu 22.04 (WSL2)
* Node.js 24 LTS
* Docker Desktop
* VS Code
* Git
* GitHub
* AWS CLI

---

## Important Constraints

* Do not implement all microservices immediately.
* Do not deploy to AWS before the local platform works.
* Do not introduce Kubernetes.
* Do not commit secrets.
* Keep the project suitable for a graduate software engineering portfolio.

--- 

## Agent Rules

When completing an iteration:

1. Read PROJECT_BRIEF.md first.
2. Read previous iteration reviews.
3. Implement only the requested iteration.
4. Run available tests.
5. Fix failures.
6. Update documentation.
7. Create docs/reviews/iteration-XX-review.md.
8. Document technical debt and future improvements.
9. Do not implement future iterations unless explicitly requested.

