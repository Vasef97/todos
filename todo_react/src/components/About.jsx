import { Box, Typography } from "@mui/material";
import "../styles/About.css";

export default function About() {
  return (
    <Box className="about-content" sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        About This App
      </Typography>

      <Typography paragraph>
        This To-Do List application offers a seamless way to organize tasks into customizable lists, blending a robust backend with a responsive, modern frontend. Users can create multiple lists—each adorned with searchable icons and pastel color palettes—and then add, edit, or remove tasks within those lists. Inline validation in modal dialogs ensures data integrity, while accessibility features like ARIA-compliant dialogs and precise focus management make the experience inclusive for all users.
      </Typography>

      <Typography paragraph>
        Under the hood, the backend is powered by Spring Boot and an H2 in-memory database for rapid development and testing. All REST endpoints are secured with Spring Security, supporting session-based authentication and role-based authorization to protect user data and enforce fine-grained access control. Swagger UI documentation provides an interactive interface for exploring and testing every GET, POST, PUT, and DELETE route.
      </Typography>

      <Typography paragraph>
        On the client side, React 18 combined with Vite delivers lightning-fast bundling and hot-module replacement during development. Material UI drives a consistent, theme-driven design system, while Axios handles authenticated API calls via cookies and environment-based base URLs. The result is a polished UI featuring modal workflows, dynamic styling utilities, and an intuitive color-picker and icon search.
      </Typography>

      <Typography paragraph>
        Built with maintainability in mind, the project’s clear component structure and environment-driven configuration make it easy to extend or adapt. Whether you’re exploring the live Swagger docs or diving into the React components, this application serves as a practical demonstration of full-stack best practices.
      </Typography>

      <Typography paragraph>
        Version: 1.0.0<br />
        © 2025 Vasilis Efstathiou
      </Typography>
    </Box>
  );
}
