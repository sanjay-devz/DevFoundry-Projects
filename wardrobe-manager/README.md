# Wardrobe Manager

**Organize better. Dress smarter.** Wardrobe Manager is a full-stack personal wardrobe studio for cataloguing clothing, saving outfits, planning a week of looks, coordinating colors, and keeping up with garment care.

## Product overview

The application uses a responsive React interface and a REST API backed by MongoDB. All wardrobe data is scoped to the authenticated account. Photos are uploaded to Cloudinary; the API stores only optimized image URLs and Cloudinary public IDs.

### Features

- Email and password registration, login, logout, profile editing, and password updates.
- HTTP-only JWT cookies, bcrypt password hashing, protected routes, and rate-limited authentication endpoints.
- Wardrobe catalogue with search, category/color/season fields, pagination, item editing, and image upload.
- Saved outfits that reference the owner's actual clothing items, including favorites.
- Monday to Sunday outfit planner with multiple looks per day and week navigation.
- Rule-based complementary, analogous, and triadic color suggestions from selected wardrobe colors.
- Dedicated accessory catalogue and clothing maintenance tasks.
- Dashboard counts, category distribution, recent items, and upcoming care tasks from MongoDB.

## Technology

- Client: React 18, Vite, React Router, Axios, Tailwind CSS, Lucide React.
- Server: Node.js, Express, Mongoose, MongoDB, bcrypt, JWT, Cloudinary.
- Security: Helmet, CORS allowlist, HTTP-only cookies, origin checks on API requests that change data, authentication rate limiting, and request/schema validation.

## Architecture

```text
client/                 React single-page application
  src/components/       Shared forms, headings, route guards
  src/context/          Authentication state
  src/hooks/            Collection loading hook
  src/layouts/          Authenticated studio shell
  src/pages/            Landing, account, wardrobe, outfits, planner, colors, care
  src/services/         Axios API client
  src/utils/            Color conversion and harmony calculations
server/                 Express REST API
  config/               MongoDB and Cloudinary configuration
  controllers/          Authentication and dashboard operations
  middleware/           Authentication, origin, and error handling
  models/               Mongoose models and indexes
  routes/               REST resources
  utils/                Auth tokens and scoped CRUD helpers
```

### Data models

`User`, `ClothingItem`, `Outfit`, `OutfitPlan`, `Accessory`, and `MaintenanceTask` use Mongoose timestamps. Wardrobe resources include an owner reference and queries filter on the authenticated user. Outfit saves validate every selected clothing reference against that owner. Planner entries validate their outfit reference in the same way.

## API

All responses use `{ "success": boolean, "data"?: object, "message"?: string }`.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account and establish a session |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/logout` | Clear the session cookie |
| GET | `/api/auth/me` | Current account |
| PUT | `/api/auth/profile` | Update account name |
| PUT | `/api/auth/password` | Change password |
| GET, POST | `/api/clothing` | List (search/filter/page) or create wardrobe items |
| GET, PUT, DELETE | `/api/clothing/:id` | Read, update, or delete a wardrobe item |
| POST | `/api/clothing/image` | Upload an image as multipart field `image` (max 5 MB) |
| GET, POST | `/api/outfits` | List or create saved outfits |
| GET, PUT, DELETE | `/api/outfits/:id` | Read, update, or delete outfits |
| GET, POST | `/api/planner` | List plans (optional `from`/`to`) or plan an outfit |
| PUT, DELETE | `/api/planner/:id` | Update or remove a plan |
| GET, POST | `/api/accessories` | List or create accessories |
| GET, PUT, DELETE | `/api/accessories/:id` | Read, update, or delete accessories |
| GET, POST | `/api/maintenance` | List or create care tasks |
| PUT, DELETE | `/api/maintenance/:id` | Update or remove a care task |
| GET | `/api/dashboard/stats` | Authenticated dashboard metrics |
| GET | `/api/health` | API health response |

Collection endpoints accept `page` and `limit` (maximum 60). Wardrobe search accepts `q`, `category`, `color`, and `season`; accessories accept `q` and `type`.

## Local development

Requirements: Node.js 20 or newer, npm, and MongoDB (local or Atlas). Cloudinary is needed for image uploads; the rest of the app can run without it.

1. Install dependencies from the repository root, then in each app directory:

   ```sh
   npm install
   npm install --prefix server
   npm install --prefix client
   ```

2. Copy `server/.env.example` to `server/.env`. Set `MONGODB_URI` and a random `JWT_SECRET` with at least 32 characters. Add Cloudinary credentials to enable uploads.
3. Copy `client/.env.example` to `client/.env` if the API is not at `http://localhost:5000/api`.
4. Start the apps in separate terminals:

   ```sh
   npm run dev --prefix server
   npm run dev --prefix client
   ```

   The client is available at `http://localhost:5173`; the API is at `http://localhost:5000`.

The root `npm run dev` script also starts both processes (install root dependencies first).

## Environment variables

| Variable | Location | Purpose |
| --- | --- | --- |
| `PORT` | Server | API port (default `5000`) |
| `NODE_ENV` | Server | `development` or `production` |
| `CLIENT_URLS` | Server | Comma-separated allowed client origins |
| `MONGODB_URI` | Server | MongoDB connection string |
| `JWT_SECRET` | Server | Random signing secret, minimum 32 characters |
| `CLOUDINARY_CLOUD_NAME` | Server | Cloudinary account name |
| `CLOUDINARY_API_KEY` | Server | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Server | Cloudinary API secret |
| `VITE_API_URL` | Client | API base URL, default `http://localhost:5000/api` |

Never put database, JWT, or Cloudinary secrets in client variables. In production, HTTPS is required for secure cross-site session cookies. Add the exact frontend origin to `CLIENT_URLS`.

## Build and deployment

Build the static client with `npm run build --prefix client`. Serve `client/dist` from Vercel or another static host and deploy `server/` as a Node service (for example, Render). Set the environment variables above in each provider. Provision MongoDB Atlas and Cloudinary separately. Configure the frontend `VITE_API_URL` to the deployed API URL ending in `/api`, and configure the server `CLIENT_URLS` to the deployed frontend origin. Verify `/api/health`, registration, sign-in, image upload, and cookie persistence over HTTPS after deployment.

The repository includes Vercel SPA rewrites in `client/vercel.json` and a Render service template in `render.yaml`. Run the available unit tests with `npm test` from the repository root. They cover color conversion/harmony logic, origin protection, and schema validation. A live database is required to exercise registration, CRUD persistence, and cross-account isolation end to end.

## Screenshots

Add current product screenshots here after running the app locally.

## Roadmap

- Automated end-to-end coverage across browser and API workflows.
- Bulk wardrobe imports and richer garment details.
- Weather-aware planning and calendar export.
- Optional profile image uploads and account deletion.
- Cloud image cleanup retries and storage usage reporting.
