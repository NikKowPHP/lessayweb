
1. Code Architecture Rules
   - Clean Architecture principles
   - SOLID principles application
   - DRY (Don't Repeat Yourself)
   - KISS (Keep It Simple, Stupid)
   - Feature-first organization
   - Atomic Design pattern

2. TypeScript Standards
   - Strict type checking enabled
   - No 'any' types allowed
   - Interfaces over types for objects
   - Enums for fixed values
   - Generic types when applicable
   - Type guards for runtime checks
   - Proper type naming conventions
   ```
   interface ButtonProps {...}
   type CardVariant = 'primary' | 'secondary'
   enum UserRole {...}
   ```

3. Component Design Rules
   - Functional components only
   - Custom hooks for logic separation
   - Props interface definition required
   - Default props when applicable
   - Composition over inheritance
   - Single responsibility principle

4. Styling Standards (Tailwind)
   - Custom theme configuration
   - Consistent color palette
   - Responsive design breakpoints
   - CSS custom properties for themes
   - Utility-first approach
   - Common spacing scale
   - Component-specific styles

5. Design System Constants
   Colors:
   ```
   Primary: #0066FF
   Secondary: #F7F7F7
   Text: 
     - Primary: #1A1A1A
     - Secondary: #666666
     - Tertiary: #999999
   ```

   Typography:
   ```
   Font Family: Inter
   Scale:
     - xs: 12px
     - sm: 14px
     - base: 16px
     - lg: 18px
     - xl: 20px
     - 2xl: 24px
     - 3xl: 30px
     - 4xl: 36px
   ```

   Spacing:
   ```
   4px incremental scale:
   - 4px
   - 8px
   - 16px
   - 24px
   - 32px
   - 48px
   - 64px
   ```

6. Naming Conventions
   - Components: PascalCase
   - Functions: camelCase
   - Variables: camelCase
   - Constants: UPPERCASE_SNAKE_CASE
   - Files: kebab-case
   - CSS classes: kebab-case

7. State Management Rules
   - React Context for global state
   - Local state when possible
   - Immutable state updates
   - State normalization
   - Predictable state changes

8. Performance Guidelines
   - Lazy loading for routes
   - Code splitting at route level
   - Image optimization
   - Memoization when necessary
   - Bundle size monitoring
   - Tree shaking enabled

9. Testing Standards
   ```
   File naming: ComponentName.test.tsx
   Test structure:
   - Unit tests for utils
   - Integration tests for features
   - E2E tests for critical paths
   ```

10. Git Workflow
    ```
    Branch naming:
    - feature/feature-name
    - fix/bug-name
    - refactor/scope
    - docs/scope

    Commit convention:
    - feat: new feature
    - fix: bug fix
    - refactor: code refactoring
    - docs: documentation
    - style: formatting
    - test: testing
    ```

11. Documentation Requirements
    - Component documentation
    - API documentation
    - Setup instructions
    - Architecture decisions
    - Style guide
    - Contributing guidelines

12. Project Quality Checklist
    - Accessibility (WCAG) compliance
    - Performance metrics
    - Code coverage
    - Bundle size limits
    - Lighthouse scores

13. Error Handling
    - Global error boundary
    - Consistent error messages
    - Error logging strategy
    - User-friendly error states
    - Error recovery patterns

14. Security Guidelines
    - Input validation
    - XSS prevention
    - CSRF protection
    - Secure data handling
    - Environment variables

15. Code Review Guidelines
    - Performance impact
    - Security implications
    - Code style consistency
    - Test coverage
    - Documentation updates

Would you like me to elaborate on any of these sections or provide more specific examples for implementation?