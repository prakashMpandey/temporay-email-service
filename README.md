# Temporary Email Service

A full-stack temporary email service built with Django and React for generating disposable email addresses and receiving emails in real-time.

## Features

- Generate temporary email addresses instantly
- Receive and view emails in real-time with HTML rendering
- Automatic email cleanup with scheduled tasks
- RESTful API for easy integration
- Responsive UI with React and Tailwind CSS
- Docker support for easy deployment

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client Layer                                  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    React Frontend (Vite + Tailwind CSS)           │  │
│  │        - Email Generation UI  - Message Viewer  - Email List     │  │
│  └────────────────────────────┬──────────────────────────────────────┘  │
└────────────────────────────────┼─────────────────────────────────────────┘
                                 │ HTTP/REST API
                                 │
┌────────────────────────────────┼─────────────────────────────────────────┐
│                   Application Layer (Django Backend)                    │
│  ┌────────────────────────────┴──────────────────────────────────────┐  │
│  │                     Django REST Framework                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐    │  │
│  │  │    Views     │  │ Serializers  │  │    URL Routing       │    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘    │  │
│  └────────────────────────────┬──────────────────────────────────────┘  │
│                                │                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      Business Logic Layer                       │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │    │
│  │  │    Models    │  │    Tasks     │  │      Utils           │  │    │
│  │  │  - Email     │  │  - Cleanup   │  │  - Name Generator    │  │    │
│  │  │  - Message   │  │  - Celery    │  │  - Email Parser      │  │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘  │    │
│  └─────────────────────────────┬───────────────────────────────────┘    │
└────────────────────────────────┼─────────────────────────────────────────┘
                                 │
┌────────────────────────────────┼─────────────────────────────────────────┐
│                        Infrastructure Layer                             │
│  ┌────────────────┐  ┌─────────┴──────┐  ┌──────────────────────────┐  │
│  │  SMTP Server   │  │   Database     │  │   Task Queue             │  │
│  │  (aiosmtpd)    │  │   (SQLite)     │  │                          │  │
│  │                │  │                │  │  ┌────────────────────┐  │  │
│  │  - Receives    │  │  - Emails      │  │  │  Celery Workers    │  │  │
│  │    emails      │  │  - Messages    │  │  │  - Email cleanup   │  │  │
│  │  - Port 1025   │  │                │  │  │  - Scheduled tasks │  │  │
│  └────────────────┘  └────────────────┘  │  └────────────────────┘  │  │
│                                          │  ┌────────────────────┐  │  │
│                                          │  │  Celery Beat       │  │  │
│                                          │  │  - Task scheduler  │  │  │
│                                          │  └────────────────────┘  │  │
│                                          │  ┌────────────────────┐  │  │
│                                          │  │  Redis/RabbitMQ    │  │  │
│                                          │  │  - Message broker  │  │  │
│                                          │  └────────────────────┘  │  │
│                                          └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. Email Generation Flow:
   User → Frontend → API (GET /api/new/) → Generate Random Email → Return Email → Display

2. Email Reception Flow:
   External SMTP → SMTP Server (Port 1025) → Parse Email → Store in DB → Available via API

3. Email Retrieval Flow:
   User → Frontend → API (GET /api/messages/{email}) → Query DB → Return Messages → Display

4. Email Cleanup Flow:
   Celery Beat → Scheduled Task → Delete Old Emails → Update DB
```

## Tech Stack

- **Frontend:** React 19, Vite 8, Tailwind CSS 4
- **Backend:** Django 6, Django REST Framework, Celery, Redis
- **Email Processing:** aiosmtpd, mail-parser
- **Database:** SQLite (PostgreSQL/MySQL compatible)
- **DevOps:** Docker, Docker Compose

## Project Structure

```
temp-mail/
├── frontend/                   # React app (Vite + Tailwind)
│   ├── src/                   # Components and source files
│   └── package.json
│
├── tempmail/                  # Django backend
│   ├── api/                  # API app (models, views, serializers, tasks)
│   ├── tempmail/            # Django settings
│   └── requirements.txt
│
└── docker-compose.yaml
```

## Quick Start

### Using Docker (Recommended)

```bash
git clone <repository-url>
cd temp-mail
docker-compose up --build
```

### Local Development

**Backend:**
```bash
cd tempmail
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

In separate terminals:
```bash
python manage.py start_smtp_server
celery -A tempmail worker -l info
celery -A tempmail beat -l info
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Configuration

**Backend (.env in tempmail/):**
```env
SECRET_KEY=your-secret-key
DEBUG=True
EMAIL_DOMAIN=example.com
SMTP_PORT=1025
REDIS_URL=redis://localhost:6379/0
```

**Frontend (.env in frontend/):**
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## API Endpoints

**Base URL:** `http://localhost:8000/api`

**Generate Email:** `GET /api/new/`
```json
{"email": "JohnSmith@example.com", "created_at": "2026-04-04T12:00:00Z"}
```

**Get Messages:** `POST /api/messages/`
```json
{"email": "JohnSmith@example.com"}
```

**Get Message Details:** `GET /api/messages/{id}/`

## Screenshots

### Home Page
![Home Page](/screenshots/home.png)
*Email generation interface*

---

## Development

**Run Tests:**
```bash
cd tempmail && python manage.py test
cd frontend && npm run test
```

**Build for Production:**
```bash
cd frontend && npm run build
cd tempmail && python manage.py collectstatic
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/name`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with Django, React, and Celery
