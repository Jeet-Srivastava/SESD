# Smart Campus Complaint Management System

## 1. Project Overview

Smart Campus Complaint Management System is a full-stack application designed to streamline complaint handling within a university campus or hostel environment.

The system enables students to raise complaints, automatically categorizes them, assigns priority levels, tracks resolution progress, and escalates unresolved issues based on predefined SLA rules.

The backend is designed using strong software engineering principles including layered architecture, OOP principles, and design patterns.

This project focuses primarily on backend architecture (75% weightage) with a clean and minimal frontend dashboard (25%).

---

## 2. Problem Statement

In many campuses, complaint handling is manual, slow, and poorly tracked. There is:

- No proper status tracking
- No automatic prioritization
- No escalation mechanism
- No accountability tracking
- No performance analytics

This system aims to solve these problems using a structured backend-driven solution.

---

## 3. Core Features

### 1. User Roles
- Student
- Admin
- Maintenance Staff

### 2. Complaint Management
- Create complaint
- Attach images
- Categorize complaint
- Assign priority (Low/Medium/High/Critical)
- Track complaint status

### 3. Complaint Lifecycle (State-Based)
Complaint states:
- CREATED
- ASSIGNED
- IN_PROGRESS
- RESOLVED
- CLOSED
- ESCALATED

(State Pattern implemented in backend)

### 4. Smart Features (AI-Integrated)
- Automatic complaint categorization
- Automatic priority detection
- Similar complaint detection
- Suggested resolution hints for staff

### 5. SLA & Escalation Engine
- Automatic escalation if unresolved beyond time limit
- Escalation hierarchy support

### 6. Notification System
- Email/Push notifications
- Status change alerts

### 7. Analytics Dashboard
- Complaint trends
- Resolution time
- Staff performance metrics

---

## 4. Backend Architecture

The backend follows layered architecture:

Controller → Service → Repository → Database

Key backend components:

- Authentication Service (JWT-based)
- Complaint Service
- AI Service
- Escalation Service
- Notification Service
- Analytics Service

---

## 5. OOP Principles Applied

- Encapsulation: Business logic hidden inside services
- Abstraction: Repository interfaces
- Inheritance: BaseUser → Student/Admin/Staff
- Polymorphism: Different complaint handling strategies
- State Pattern: Complaint lifecycle management
- Strategy Pattern: Priority assignment logic

---

## 6. Technology Stack

Backend:
- Node.js + Express (or Spring Boot)
- PostgreSQL
- Redis (for caching & rate limiting)
- JWT Authentication

Frontend:
- React
- Basic admin dashboard

AI Integration:
- External LLM API for classification & suggestion
- Wrapped inside AIService abstraction

---

## 7. Non-Functional Requirements

- Secure authentication
- Role-based access control
- Clean API structure
- Exception handling
- Logging
- Scalable design
- Regular commits with clear structure

---

## 8. Future Enhancements

- Mobile app integration
- Real-time chat between student and staff
- Predictive maintenance analytics
- Complaint heatmap visualization

---

## 9. Conclusion

This project demonstrates strong backend system design, OOP implementation, and practical AI integration while solving a real-world campus problem.