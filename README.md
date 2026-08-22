# Travlr Getaways

**Author:** Leslie Rendulic Kates  
**Course:** CS 465 Full Stack Development  
**Institution:** Southern New Hampshire University

Travlr Getaways is a full stack MEAN application for a fictional beach resort. Customers use a static HTML site with a Handlebars-rendered Travel page. Administrators use an Angular SPA with JWT login to create, update, and delete trips. Both frontends share one Express REST API and MongoDB database.

**Run the customer site and API:** `npm start` → http://localhost:3000  
**Run the admin SPA:** `cd app_admin` then `ng serve` → http://localhost:4200  
**Seed trips:** `node app_api/models/seed.js`  
Requires a `.env` file with `JWT_SECRET` and a local MongoDB instance.

---

## Architecture

**Compare and contrast the types of frontend development you used in your full stack project, including Express HTML, JavaScript, and the single-page application (SPA).**

The customer site uses Express HTML: most pages are static files in `public/`, while the Travel page is server-rendered with Handlebars and JavaScript after the controller reads trips from MongoDB. Each click loads a new page from the server. The admin side is an Angular SPA that loads once and swaps components through client-side routing, talking to the backend only through JSON API calls. Static HTML is best for unchanging marketing pages, Express/Handlebars adds dynamic data without a heavy client, and the SPA is better for an interactive, authenticated admin dashboard.

**Why did the backend use a NoSQL MongoDB database?**

MongoDB was a good fit because each trip is a self-contained document (code, name, dates, resort, price, image, description) that already looks like JSON. There were no complex relational joins to model, and the same documents could move from a seed JSON file into the database and then out through the API to Angular with very little translation. It also matches the MEAN stack, so JavaScript and JSON are used from the database through Express to the frontend.

## Functionality

**How is JSON different from Javascript and how does JSON tie together the frontend and backend development pieces?**

JavaScript is a programming language with logic, functions, and types. JSON is only a data format: text that represents objects, arrays, strings, numbers, booleans, and null, with no executable code. JSON ties the stack together because MongoDB stores documents as JSON-like objects, Express sends and receives JSON on `/api` endpoints, and Angular deserializes that JSON into `Trip` and `User` models. Both frontends stay in sync because they share that JSON contract.

**Provide instances in the full stack process when you refactored code to improve functionality and efficiencies, and name the benefits that come from reusable user interface (UI) components.**

Trip content started hard-coded in HTML, moved into `trips.json`, then into MongoDB, and finally behind a shared REST API so the customer site and admin SPA were not maintaining two copies of the same data. Duplicate routes and views were cleaned up as the app grew into MVC, and login/register were later folded into one auth helper instead of two separate HTTP paths. Reusable UI components such as `TripCardComponent` and the navbar meant layout and edit/login behavior were defined once and reused across the listing. That keeps the UI consistent, reduces duplicate code, and makes later changes faster because a fix in one component updates every place it is used.

## Testing

**Methods for request and retrieval necessitate various types of API testing of endpoints, in addition to the difficulties of testing with added layers of security. Explain your understanding of methods, endpoints, and security in a full stack application.**

An endpoint is a URL for a resource, such as `/api/trips` or `/api/login`. The HTTP method says what to do: GET retrieves, POST creates (or logs in), PUT updates, and DELETE removes. Public GET tests are straightforward, but after JWT was added, POST, PUT, and DELETE also have to be tested without a token (expect 401) and with a valid `Authorization: Bearer` token (expect success). Security belongs on the server—hashed passwords, Passport login, and JWT checks—because hiding buttons in Angular is not enough. Testing a secured full stack app means covering both the authenticated path and the rejected one.

## Reflection

**How has this course helped you in reaching your professional goals? What skills have you learned, developed, or mastered in this course to help you become a more marketable candidate in your career field?**

This course took me from a static website to a complete full stack application I can explain end to end, which is the kind of work I want to do professionally. I learned Express MVC, MongoDB/Mongoose, REST APIs, Angular components and services, and JWT authentication with Passport. I also practiced refactoring, Git, and keeping one source of truth for two frontends. Those MEAN-stack and security skills make me a stronger candidate for full stack development roles.
