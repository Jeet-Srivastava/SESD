```mermaid
classDiagram

class BaseUser {
  +id
  +name
  +email
  +password
  +login()
}

class Student
class Admin
class Staff

BaseUser <|-- Student
BaseUser <|-- Admin
BaseUser <|-- Staff

class Complaint {
  +id
  +title
  +description
  +status
  +priority
  +create()
  +updateStatus()
}

class ComplaintService {
  +createComplaint()
  +assignComplaint()
  +updateStatus()
}

class AIService {
  +classifyComplaint()
  +suggestResolution()
}

class EscalationService {
  +checkSLA()
  +escalateComplaint()
}

class Repository {
  +save()
  +findById()
  +update()
}

ComplaintService --> AIService
ComplaintService --> EscalationService
ComplaintService --> Repository