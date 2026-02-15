```mermaid
erDiagram

USER {
  int id PK
  string name
  string email
  string password
  string role
}

COMPLAINT {
  int id PK
  string title
  string description
  string status
  string priority
  int student_id FK
  int staff_id FK
  datetime created_at
}

COMMENT {
  int id PK
  int complaint_id FK
  int user_id FK
  string message
  datetime created_at
}

ESCALATION {
  int id PK
  int complaint_id FK
  datetime escalated_at
  string level
}

USER ||--o{ COMPLAINT : raises
USER ||--o{ COMMENT : writes
COMPLAINT ||--o{ COMMENT : contains
COMPLAINT ||--o{ ESCALATION : has