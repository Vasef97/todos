# todos
Usage Instructions

Backend (Spring Boot API)

Open a new terminal and navigate to the Spring project directory.

On Linux or macOS run ./mvnw spring-boot:run On Windows run mvnw.cmd spring-boot:run

Alternatively, launch the SpringBootApplication class from your IDE.

Navigation React UI: http://localhost:5173 API root (health check, etc.): http://localhost:8080/ H2 console: http://localhost:8080/h2-console JDBC URL: jdbc:h2:mem:todo User: sa (leave password blank unless you have configured one) Swagger UI: http://localhost:8080/swagger-ui.html or http://localhost:8080/swagger-ui/index.html

Frontend (React + Vite)

Open a terminal and navigate to the React app directory.

Run npm install to install all dependencies.

Run npm run dev to start the development server.

Open your browser at http://localhost:5173 to view the UI.


Once both frontend and backend are running, the React app will communicate with the Spring API. You can experiment with data directly in the H2 console and test all endpoints interactively via Swagger.



Under the hood, the backend is powered by Spring Boot and an H2 in-memory database for rapid development and testing. All REST endpoints are secured with Spring Security, supporting session-based authentication and role-based authorization to protect user data and enforce fine-grained access control. Swagger UI documentation provides an interactive interface for exploring and testing every GET, POST, PUT, and DELETE route.
On the client side, React 18 combined with Vite delivers lightning-fast bundling and hot-reload during development. Material UI drives a consistent, theme-driven design system, while Axios handles authenticated API calls via cookies and environment-based base URLs. The result is a polished UI featuring modal workflows, dynamic styling utilities, and an intuitive color-picker and icon search.
Built with maintainability in mind, the project’s clear component structure and environment-driven configuration make it easy to extend or adapt. Whether you’re exploring the live Swagger docs or diving into the React components, this application serves as a practical demonstration of full-stack best practices.
