# Source Code Structure

- auth/      - Authentication module (JWT, Google OAuth)
- users/     - User management module
- todos/     - Todo CRUD operations module
- common/    - Shared utilities
  - guards/     - Auth guards, role guards
  - decorators/ - Custom decorators
  - interfaces/ - Shared interfaces
  - filters/    - Exception filters
- config/    - Configuration module
- database/  - Database configuration, schemas, migrations
- main.ts    - Application entry point