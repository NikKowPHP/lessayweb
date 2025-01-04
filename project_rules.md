lessay Project - Frontend Development Standards and Guidelines

1. Introduction

This document outlines the coding standards, architectural guidelines, and development processes for the frontend of the "lessay" web application. The primary goals of these standards are:

Maintainability: Ensure the codebase is easy to understand, modify, and extend over time.

Scalability: Design the application to handle increasing traffic and data volume efficiently.

Testability: Facilitate writing comprehensive unit, integration, and end-to-end tests.

Performance: Optimize the application for fast loading times and smooth user interactions.

Security: Adhere to security best practices to protect user data and prevent vulnerabilities.

Consistency: Enforce a consistent coding style and project structure across the entire codebase.

2. Core Principles

Senior-Level Code: All code must be written at a senior developer level, demonstrating a deep understanding of JavaScript/TypeScript, React, Next.js the latest version 13+, and web development best practices.

Project flow: ui -> provider ->  service -> session storage <-> api service 

Strict Adherence: These standards are not optional. All developers are required to follow them strictly. Deviations must be justified and approved by the lead developer.

Code Reviews: All code must undergo thorough code reviews by at least one other senior developer before being merged into the main branch.

Continuous Learning: Developers are expected to stay up-to-date with the latest technologies and best practices in the frontend ecosystem.

3. Technology Stack

Language: TypeScript

Framework: Next.js (React)

Styling: Tailwind CSS

State Management: Redux Toolkit

API Interaction: Axios

Testing: Jest, React Testing Library, Cypress (or Playwright)

Code Formatting: Prettier

Linting: ESLint

4. Project Structure

The project will follow the structure outlined in the Frontend Architecture Documentation (Section 11). Strict adherence to this structure is mandatory to maintain organization and consistency.

5. Coding Standards

TypeScript:

Strict Mode: Always enable strict mode in tsconfig.json.

Explicit Types: Use explicit types for all variables, function parameters, and return values. Avoid any type as much as possible, and justify its use with comments when necessary.

Interfaces: Define interfaces for all complex data structures and objects.

Generics: Utilize generics to create reusable and type-safe components and functions.

Naming Conventions:

Variables and Functions: camelCase

Classes and Interfaces: PascalCase

Constants: UPPER_SNAKE_CASE

Components: PascalCase (e.g., UserProfile.tsx)

Files: kebab-case (e.g., user-profile.tsx), except for components, which use PascalCase to match the component name.

Folders: kebab-case

Descriptive Names: Choose clear and descriptive names that accurately reflect the purpose of the variable, function, or component.

Code Formatting:

Use Prettier with a consistent configuration across the project to automatically format code. Integrate Prettier into your IDE/editor for automatic formatting on save.

Comments:

Use comments to explain complex logic, algorithms, or design decisions.

Document all functions and classes using JSDoc-style comments, including parameter types, return types, and a brief description.

Error Handling:

Implement robust error handling using try...catch blocks.

Handle errors gracefully and provide informative error messages to the user when appropriate.

Log errors to a suitable logging system (e.g., console in development, a dedicated logging service in production).

Avoid Magic Numbers and Strings:

Define constants for all magic numbers and strings to improve code readability and maintainability.

6. React and Next.js Best Practices

Functional Components: Use functional components and hooks exclusively. Avoid class components.

Hooks:

Follow the Rules of Hooks.

Create custom hooks to encapsulate reusable logic, especially for data fetching, state management, and side effects.

Component Design:

Single Responsibility Principle: Each component should have a single, well-defined purpose.

Small Components: Break down complex UIs into smaller, reusable components.

Props: Keep component props minimal and focused. Use prop drilling sparingly; consider context or state management for sharing data across multiple components.

Composition: Favor component composition over inheritance.

Next.js:

Data Fetching: Utilize Next.js's data fetching methods (getServerSideProps, getStaticProps, getStaticPaths) appropriately based on the data requirements of each page.

API Routes: Use API routes for serverless functions that handle backend logic or interact with external services.

Image Optimization: Use the next/image component for optimized image loading and delivery.

Routing: Leverage Next.js's file-based routing system effectively.

State Management:

Redux Toolkit: Use Redux Toolkit for managing global application state, following the recommended patterns and practices.

Slices: Create well-structured slices for different parts of the application state.

Selectors: Use selectors to efficiently access and derive data from the Redux store.

Asynchronous Actions: Use createAsyncThunk for handling asynchronous actions like API requests.

7. Design Patterns

Container/Presentational Pattern: Separate components into container components (handling logic and data fetching) and presentational components (handling UI rendering). This improves code organization and reusability.

Higher-Order Components (HOCs): Use HOCs sparingly for cross-cutting concerns like authentication or authorization, but prefer custom hooks for most logic encapsulation.

Render Props: Consider render props for cases where you need to share component logic in a more flexible way than HOCs, but be mindful of potential complexity.

Provider Pattern: Utilize the Provider pattern (with React Context) to provide data and functionality to multiple components without prop drilling.

Hooks Pattern: Embrace the hooks pattern for managing state, side effects, and reusable logic within functional components.

Singleton Pattern: Use the Singleton pattern cautiously and only when absolutely necessary, such as for managing a global service or resource.

8. API Interaction

Centralized API Client: Create a centralized API client using Axios to handle all API requests. This allows for consistent error handling, request/response interception, and configuration.

Environment Variables: Store API base URLs and other environment-specific configuration in environment variables.

Data Transformation: Transform API responses into a format that is suitable for your application's needs, preferably within the API client or in dedicated data transformation functions.

9. Styling

Tailwind CSS: Use Tailwind CSS utility classes for styling.

Component-Specific Styles: For styles that are unique to a specific component and cannot be expressed with utility classes, use CSS modules or styled-components within that component.

Avoid Inline Styles: Do not use inline styles.

Theming: Define a theme using Tailwind's configuration to ensure consistency in colors, typography, and spacing across the application.

10. Testing

Test-Driven Development (TDD): Strongly encouraged, but not strictly mandatory. When practicing TDD, write tests before implementing the code.

Unit Tests:

Jest and React Testing Library: Use Jest as the test runner and React Testing Library for rendering and interacting with components in tests.

Coverage: Aim for high test coverage (at least 80%) for unit tests.

Mocking: Mock external dependencies (like API calls) in unit tests.

Integration Tests:

Test the interaction between multiple components or modules.

End-to-End (E2E) Tests:

Cypress or Playwright: Use Cypress or Playwright to write E2E tests that simulate user interactions with the application in a real browser.

Critical Flows: Focus on testing the most critical user flows and features.

11. Security

Authentication:

Follow secure authentication practices, such as using HTTPS, storing tokens securely (e.g., in HTTP-only cookies), and implementing proper password hashing on the backend.

Authorization:

Implement role-based access control (RBAC) on the backend to restrict access to sensitive data and functionality based on user roles.

Input Validation:

Validate all user inputs on both the frontend and backend to prevent common vulnerabilities like cross-site scripting (XSS) and SQL injection. Sanitize user inputs on the frontend before displaying them.

Data Protection:

Protect sensitive user data by encrypting it at rest and in transit.

Dependency Management:

Regularly update dependencies to patch security vulnerabilities. Use tools like npm audit or yarn audit to identify vulnerable packages.

Security Audits:

Conduct periodic security audits and penetration testing to identify and address potential security risks.

12. Performance Optimization

Code Splitting: Leverage Next.js's automatic code splitting to reduce the initial bundle size and improve page load times.

Lazy Loading: Lazy load components, images, and other resources that are not immediately needed on the initial page load.

Image Optimization: Use Next.js's Image component to optimize images for different screen sizes and formats. Consider using a CDN for image delivery.

Memoization: Use React.memo, useMemo, and useCallback to memoize expensive computations and prevent unnecessary re-renders.

Performance Monitoring: Use tools like the React Profiler, Lighthouse, and WebPageTest to monitor and analyze performance bottlenecks.

13. Documentation

Code Comments: Write clear and concise comments to explain complex code or design decisions.

README: Maintain a comprehensive README file that describes the project, its architecture, setup instructions, and other relevant information.

API Documentation: If you are building a public API, provide detailed API documentation using tools like Swagger or OpenAPI.

14. Version Control (Git)

Branching Strategy: Use a feature branch workflow. Create a new branch for each feature or bug fix.

Commit Messages: Write clear and descriptive commit messages that follow a consistent format (e.g., Conventional Commits).

Pull Requests: Use pull requests for code reviews and merging changes into the main branch.

15. Continuous Integration and Continuous Deployment (CI/CD)

CI/CD Pipeline: Set up a CI/CD pipeline to automate the build, testing, and deployment process.

Automated Tests: Run all tests (unit, integration, E2E) automatically as part of the CI/CD pipeline.

Deployment: Automate the deployment process to staging and production environments.

16. Accessibility

WCAG Guidelines: Follow the Web Content Accessibility Guidelines (WCAG) to make the application accessible to users with disabilities.

Semantic HTML: Use semantic HTML elements (e.g., nav, article, aside, header, footer) to provide structure and meaning to your content.

ARIA Attributes: Use ARIA attributes when necessary to enhance the accessibility of dynamic or interactive components.

Keyboard Navigation: Ensure that all interactive elements can be accessed and operated using the keyboard alone.

Color Contrast: Use sufficient color contrast between text and background to meet accessibility standards.

Screen Readers: Test the application with screen readers (e.g., NVDA, VoiceOver) to ensure it is usable for visually impaired users.

17. Code Review Checklist

Functionality: Does the code meet the requirements and specifications?

Design: Is the code well-structured, modular, and easy to understand?

Efficiency: Is the code performant and optimized?

Security: Does the code follow security best practices and avoid common vulnerabilities?

Testability: Is the code well-tested with unit, integration, and/or E2E tests?

Style: Does the code adhere to the project's coding standards and style guide?

Documentation: Is the code adequately documented with comments and a README?

Accessibility: Does the code meet accessibility guidelines?

18. Amendments

This document may be amended as needed to reflect changes in the project's requirements, technology stack, or development processes. Any amendments must be approved by the lead developer and communicated to the entire development team.

