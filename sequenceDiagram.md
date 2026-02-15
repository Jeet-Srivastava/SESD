```mermaid
sequenceDiagram
participant Student
participant Controller
participant ComplaintService
participant AIService
participant Repository
participant Database
participant NotificationService

Student->>Controller: Create Complaint Request
Controller->>ComplaintService: validateAndCreate()

ComplaintService->>AIService: classifyComplaint()
AIService-->>ComplaintService: category + priority

ComplaintService->>Repository: saveComplaint()
Repository->>Database: INSERT Complaint
Database-->>Repository: Success

ComplaintService->>NotificationService: notifyAdmin()
NotificationService-->>ComplaintService: Sent

ComplaintService-->>Controller: Response
Controller-->>Student: Complaint Created