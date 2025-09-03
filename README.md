# Picture Convert – FastAPI + React

Picture Convert is a small full‑stack app for user authentication and image processing (info, convert format, resize). Backend is FastAPI, frontend is React (Create React App) with Tailwind.

## Features

- JWT authentication (fastapi-users)
- Image operations (Pillow):
  - Get image info (format, size, metadata)
  - Convert format (JPEG/PNG/WEBP/BMP/TIFF)
  - Resize (keep aspect ratio if only one dimension provided)
- Clean dashboard UI with user profile and operations panel

## Tech Stack

- Backend: FastAPI, SQLAlchemy, Alembic, fastapi-users, Pillow
- Frontend: React 18 (CRA), TailwindCSS

## Requirements

- Python 3.13+
- Node.js 18+ and npm

## Project structure (key parts)

```
007.Picture_convert/
  app/                     # FastAPI application
  front/                   # React frontend
  main.py                  # Uvicorn entry
  create_main_app.py       # App factory and static docs
  pyproject.toml           # Backend deps (uv/pep 621)
  alembic/                 # DB migrations
```

## Backend – setup & run

1) Install dependencies

```bash
cd 007.Picture_convert
pip install -U uv
uv pip install -r <(uv pip compile pyproject.toml)  # or: pip install -e .
```

If you prefer plain pip, install key deps manually:

```bash
pip install fastapi uvicorn sqlalchemy alembic pydantic-settings fastapi-users pillow orjson
```

2) Environment

Create `.env` in the project root if needed (at least DB URL):

```
DB__DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/picture
DB__DATABASE_ECHO=false
```

Defaults (see `app/config.py`):
- Host: 0.0.0.0, Port: 8000
- JWT keys paths: `app/cert/public_key.pem`, `app/cert/private_key.pem`

3) Migrations (optional if DB used)

```bash
alembic upgrade head
```

4) Run backend

```bash
python main.py
# or
uvicorn main:main_app --host 0.0.0.0 --port 8000 --reload
```

API docs:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### CORS

CORS is enabled for `http://localhost:3000`. See `app/middlewaries/cors.py` and import in `main.py`.

## Frontend – setup & run

```bash
cd 007.Picture_convert/front
npm install
npm start
```

Scripts (see `front/package.json`):
- `npm start` – dev server (CRA)
- `npm run build` – production build

Frontend config:
- Base API URL: `front/src/utils/contens.js` → `API_BASE_URL = 'http://localhost:8000'`
- Endpoints map defined alongside

## Authentication

- Login: POST `/api/api_v1/auth/login` with form `username`, `password`
- After successful login, frontend stores `access_token` in localStorage and adds `Authorization: Bearer <token>` header
- Current user: GET `/api/api_v1/users/me`

## Image Endpoints (prefix `/api/api_v1/image`)

- `POST /info` – multipart with `file`
- `POST /convert/type` – multipart with `file`, `target_format`
- `POST /convert/size` – multipart with `file`, optional `width`, `height`, `target_format`
  - If only one of `width` / `height` is provided, server keeps aspect ratio
  - Response is binary image (content-type e.g. `image/jpeg`)

## UI Usage

1) Login or Register
2) On the dashboard:
   - Pick an image
   - Choose operation (Convert Format / Resize / Get Info)
   - Provide options and Run
   - For binary results, preview appears with a Download button

## Troubleshooting

- CORS blocked: ensure backend is running and CORS allows `http://localhost:3000`
- Login returns 200 but UI says invalid: confirm response has `access_token`
- Resize not changing size: make sure width/height are numbers; try one field to keep aspect ratio
- Missing CRA files: ensure `front/public/index.html` and `front/src/index.js` exist

## Notes for development

- Tailwind config: `front/tailwind.config.js`, PostCSS: `front/postcss.config.js`
- Global styles: `front/src/index.css`
- Router: `react-router-dom` (routes in `front/src/components/App.js`)

## License

MIT (see `LICENSE` if added). © 2025


