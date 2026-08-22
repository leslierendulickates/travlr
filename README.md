# Travlr Getaways

**Author:** Leslie Rendulic Kates  
**Course:** CS 465 Full Stack Development  
**Institution:** Southern New Hampshire University

Travlr Getaways is a full stack web application for a fictional beach resort. It serves two audiences from the same Node.js/Express backend and MongoDB database:

- A **customer-facing website** with static HTML pages and a dynamically rendered Travel page
- An **administrative single-page application (SPA)** built in Angular, with JWT-secured login and full CRUD for travel packages

This repository is the completed project, including secure admin authentication.

---

## Table of Contents

- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Security](#security)
- [Course Competency Reflection](#course-competency-reflection)
  - [Architecture](#architecture)
  - [Functionality](#functionality)
  - [Testing](#testing)
  - [Reflection](#reflection)

---

## Technology Stack

| Layer | Technology |
| --- | --- |
| Customer frontend | Static HTML/CSS, Express, Handlebars (HBS) |
| Admin frontend | Angular 17 SPA (TypeScript) |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Authentication | Passport Local Strategy, JSON Web Tokens (JWT), PBKDF2 password hashing |
| Data interchange | JSON |

---

## Project Structure

```
travlr/
├── app.js                 # Express application entry: middleware, CORS, routes, Passport
├── bin/www                # HTTP server (default port 3000)
├── public/                # Static customer pages (Home, Rooms, Meals, News, About, Contact)
├── app_server/            # MVC for the customer Travel page (routes, controllers, HBS views)
├── app_api/               # REST API, Mongoose models, Passport config, JWT-protected routes
│   ├── config/passport.js
│   ├── controllers/       # trips.js, authentication.js
│   ├── models/            # travlr.js (trips), user.js, db.js, seed.js
│   └── routes/index.js
├── app_admin/             # Angular admin SPA
│   └── src/app/           # trip listing, trip card, add/edit trip, login, navbar, services
└── data/trips.json        # Seed data for the trips collection
```

---

## Architecture Overview

The application is organized as a MEAN stack (MongoDB, Express, Angular, Node.js) with a second, server-rendered customer frontend sharing the same API and database.

```
Browser (customer)                 Browser (admin SPA, :4200)
  |                                      |
  | static HTML / HBS pages              | Angular components + HttpClient
  v                                      v
Express (:3000)
  ├── public/              static customer site
  ├── app_server/          Travel page rendered with Handlebars from MongoDB
  └── app_api/             REST JSON API  (/api/trips, /api/login, /api/register)
         |
         v
      MongoDB (travlr)     trips collection + users collection
```

Customer pages such as Home, Rooms, and Contact are static files in `public/`. The Travel page is rendered on the server with Handlebars after the controller reads trips from MongoDB. Administrators use the Angular SPA, which never talks to the database directly. It calls `/api` endpoints and, for create/update/delete, sends a Bearer JWT obtained at login.

---

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB running locally (default `mongodb://127.0.0.1/travlr`)
- Angular CLI (`npm install -g @angular/cli`) for the admin SPA

### Environment

Create a `.env` file in the project root (this file is gitignored):

```
DB_HOST=127.0.0.1
JWT_SECRET=your_secret_here
PORT=3000
```

### Install and seed

```bash
npm install
node app_api/models/seed.js
```

### Run the customer site and API

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) for the customer site. The REST API is available at [http://localhost:3000/api](http://localhost:3000/api).

### Run the admin SPA

```bash
cd app_admin
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200). CORS on the Express API is configured for this origin.

Register an admin account through `POST /api/register` (or the SPA login/register flow), then log in. Create, edit, and delete operations require a valid JWT.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/trips` | Public | List all trips |
| GET | `/api/trips/:tripCode` | Public | Find one trip by code |
| POST | `/api/trips` | JWT | Create a trip |
| PUT | `/api/trips/:tripCode` | JWT | Update a trip |
| DELETE | `/api/trips/:tripCode` | JWT | Delete a trip |
| POST | `/api/login` | Public | Authenticate and return a JWT |
| POST | `/api/register` | Public | Create a user and return a JWT |

Protected routes expect:

```
Authorization: Bearer <token>
```

---

## Security

- Passwords are never stored in plaintext. Each user record keeps a unique salt and a PBKDF2 (SHA-512) hash.
- Passport Local Strategy authenticates login by email and password.
- Successful login or registration returns a JWT signed with `JWT_SECRET` and set to expire in one hour.
- The Angular `JwtInterceptor` attaches the token to outbound API requests after login.
- Express middleware `authenticateJWT` verifies the token before POST, PUT, or DELETE on trips.
- Unauthorized or expired tokens return HTTP 401.

---

## Course Competency Reflection

### Architecture

**Compare and contrast the types of frontend development you used in your full stack project, including Express HTML, JavaScript, and the single-page application (SPA).**

This project uses three distinct frontend styles, and each one exists for a different kind of user and a different kind of request.

The **customer site** began as static Express HTML. Pages such as Home, Rooms, Meals, News, About, and Contact live in `public/` as ordinary HTML and CSS. Express serves those files as-is. Every navigation click requests a new document from the server. That model is simple, cache-friendly, and appropriate for marketing content that does not change with each request.

The **Travel page** is still HTML in the browser, but it is no longer static. Express plus Handlebars and JavaScript in `app_server/` implement a classic MVC flow. The travel controller queries MongoDB, then `travel.hbs` loops over `{{#each trips}}` and injects name, image, and description into the layout. The HTML is assembled on the server and sent as a finished page. JavaScript here is the glue in Node: routing, controllers, and database access, not a rich client framework. The benefit is that the customer still gets a normal multi-page website, while trip data is no longer hard-coded in HTML.

The **admin frontend** is an Angular **single-page application**. It loads once at `localhost:4200` and then client-side routing swaps `TripListingComponent`, `AddTripComponent`, `EditTripComponent`, and `LoginComponent` without a full page reload. The SPA talks to the backend only through JSON HTTP calls. That is the right model for an authenticated dashboard: the UI is interactive, state lives in the browser (token, current trip, login status), and the server exposes capabilities rather than pages.

The contrast is about where rendering and state live. Static HTML is content with no runtime data. Express HTML/Handlebars is server-rendered HTML with data bound just before the response. The SPA is client-rendered UI that treats the server as an API. Sharing one REST API and one MongoDB database lets those two frontends stay independent while remaining consistent: a trip added in Angular appears on the customer Travel page because both read the same collection.

**Why did the backend use a NoSQL MongoDB database?**

MongoDB fits this application because the primary records are self-contained trip documents, not a web of related tables. A trip is a single object: code, name, length, start date, resort, price, image, and description. That shape is already JSON. MongoDB stores it as a document, Mongoose validates it, Express returns it as JSON, and Angular deserializes it into a TypeScript `Trip` interface with almost no translation.

There was no requirement for multi-table joins, strict relational integrity across many entities, or SQL reporting. Users and trips are independent collections. A document database also tolerated the evolution of the project: seed data started as `data/trips.json`, then moved into MongoDB without a redesign of the payload. That flexibility matters in a course that iteratively replaced static HTML with JSON, then JSON files with a database, then a database with a REST API consumed by two clients.

MongoDB is also the “M” in the MEAN stack. Using it meant the entire application—Node, Express, Mongoose, Angular—speaks JavaScript and JSON. One language and one data format from the database to the admin UI reduced impedance mismatch and made the API a natural extension of the models rather than a separate mapping layer.

### Functionality

**How is JSON different from JavaScript, and how does JSON tie together the frontend and backend development pieces?**

JavaScript is a programming language. It has functions, control flow, classes, `undefined`, dates, and executable logic. JSON (JavaScript Object Notation) is not a language. It is a text format for exchanging data. JSON looks like a JavaScript object literal, but the rules are stricter: keys must be double-quoted strings, values may only be objects, arrays, strings, numbers, booleans, or null, and there are no functions or comments.

JSON is the contract between every layer of Travlr. MongoDB documents serialize to JSON. Express controllers such as `tripsList` and `login` send `res.status(...).json(...)`. The Angular `TripDataService` uses `HttpClient` to GET and POST JSON and map it onto `Trip`, `User`, and `AuthResponse` models. Login returns `{ "token": "..." }`. Create and update send a trip body that matches the Mongoose schema. The customer Travel page and the admin SPA never share UI code, but they share meaning because they share JSON. If the API changed a field name, both frontends would break in the same way—which is exactly why a stable JSON contract is what ties the stack together.

**Provide instances in the full stack process when you refactored code to improve functionality and efficiencies, and name the benefits that come from reusable user interface (UI) components.**

The project was built by successive refactoring, not as a single design frozen in Module 1.

- **Static HTML to dynamic data.** Trip details were originally hard-coded in `travel.html`. They were extracted into `data/trips.json` and rendered through Handlebars so content could change without editing markup.
- **JSON file to MongoDB.** The same trip objects became a Mongoose `trips` collection. Seeding (`app_api/models/seed.js`) replaced file I/O with a real database, which is what later allowed create, update, and delete.
- **MVC cleanup.** Duplicate routes and views were removed so Express followed a clear routes → controllers → views (or JSON) path. That made the later split into `app_server` and `app_api` possible.
- **Shared REST API.** Data access moved out of the Travel controller into `/api/trips`. The customer site and the Angular SPA then read the same source of truth instead of two copies of trip data.
- **Reusable admin UI.** `TripCardComponent` renders one trip. `TripListingComponent` repeats that card for the array returned by the API. Navbar, login, add-trip, and edit-trip are standalone components. `TripDataService` and `AuthenticationService` are shared instead of duplicating HTTP and token logic in each screen.
- **Auth as a cross-cutting concern.** Password hashing, Passport, JWT issue, route middleware, and the Angular interceptor were added as layers rather than rewriting CRUD. Login and register share `handleAuthAPICall`. The token payload is wrapped as `{ token }` so one `AuthResponse` model works for both endpoints.

Reusable UI components pay for that structure. The trip card is defined once; listing, spacing, image-path normalization, and the Edit button that appears only when `isLoggedIn()` is true all live in one place. Changing the card updates every trip on the page. The navbar owns login/logout display for every route. Components stay small, testable, and consistent. Development of Add and Edit was faster because they could assume a listing and a card already existed, and because the same `Trip` model and `TripDataService` were reused instead of copied.

### Testing

**Explain your understanding of methods, endpoints, and security in a full stack application.**

An **endpoint** is a URL that represents a resource or action, such as `/api/trips` or `/api/trips/GALR210214`. A **method** is the HTTP verb that says what to do with that resource:

| Method | Meaning in this API |
| --- | --- |
| GET | Retrieve trips (safe, public) |
| POST | Create a trip or submit login/register |
| PUT | Replace an existing trip |
| DELETE | Remove a trip |

Testing those endpoints is not one activity. Public GET requests can be checked with a browser, curl, or Postman and should return 200 with JSON or 404 when the collection or code is missing. POST without a body should return 400. POST with a valid trip should return 201. PUT and DELETE need a real `tripCode` and should 404 when the code does not exist.

Security changes that picture. After JWT was added, POST, PUT, and DELETE on trips are not fully tested unless the tester also exercises authentication. A request with no `Authorization` header must be 401. A request with a malformed or expired Bearer token must be 401. Only after `POST /api/login` (or register) returns a token can the tester replay a mutation with `Authorization: Bearer <token>` and expect 201 or 200. That extra layer is the point: the API is not “working” if an unauthenticated client can insert or edit trips.

The SPA makes this more visible. The interceptor attaches the token for the user, but the server must still verify it. Client-side `isLoggedIn()` only hides Edit/Add buttons; it is not security. Security is the server refusing the method on that endpoint without a valid JWT, hashing passwords with salt so a database leak does not reveal credentials, expiring tokens after one hour, and returning 401 for `UnauthorizedError`. Testing a secured full stack app means testing both the happy path with a token and the denied path without one.

### Reflection

**How has this course helped you in reaching your professional goals? What skills have you learned, developed, or mastered in this course to help you become a more marketable candidate in your career field?**

This course closed the gap between building a page and building a product. I started with a static Express site and finished with a MEAN application that has two frontends, a documented REST API, a document database, and production-style authentication. That is the shape of work I want to be hired to do: not isolated tutorials, but systems where UI, API, data, and security have to agree.

The skills that make that claim credible are specific. I can stand up an Express server, separate concerns into routes, controllers, and models, and expose CRUD through JSON endpoints. I can model documents in MongoDB with Mongoose and seed real data. I can build an Angular SPA with standalone components, services, routing, and HTTP interceptors. I can implement registration and login with Passport, store passwords as salted PBKDF2 hashes, issue JWTs, and protect mutating routes on the server. I also practiced the unglamorous professional habits: refactoring instead of rewriting, using Git across incremental modules, debugging CORS and token flow between `localhost:4200` and `localhost:3000`, and keeping a single source of truth so the customer site and the admin dashboard do not drift.

Those are the skills employers list for junior and mid-level full stack roles. Completing Travlr Getaways means I can talk through an architecture, walk an API with methods and status codes, explain why a mutation is rejected without a Bearer token, and point to reusable UI and a shared JSON contract as design choices rather than accidents. That is how this course advanced my professional goals: it turned a sequence of assignments into a portfolio application I can explain end to end.
