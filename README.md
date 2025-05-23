## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# NestJS Boilerplate

A production-ready NestJS boilerplate with JWT authentication, PostgreSQL, and modern tooling.

## Prerequisites

- Node.js (v20.x or higher)
- pnpm (v9.x or higher)
- Docker and Docker Compose
- Git

## Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL (Dockerized)
- **ORM**: Drizzle ORM
- **Authentication**: JWT with Refresh Tokens + Google OAuth
- **Validation**: Zod + Drizzle-Zod
- **Linting/Formatting**: Biome JS
- **API Documentation**: Postman Collection

## First Time Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd nestjs-boilerplate
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Setup PostgreSQL Database

```bash
# Start PostgreSQL container
docker-compose up -d

# Verify it's running
docker ps
```

### 4. Environment Configuration

```bash
# Copy the example env file (will be created later)
cp .env.example .env
```

### 5. Run the application

```bash
# Development mode
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

The API will be available at http://localhost:3000

## Code Quality with Biome

This project uses Biome for linting and formatting instead of ESLint/Prettier.

### Biome Commands

```bash
# Check for linting and formatting issues
pnpm run check

# Format code
pnpm run format

# Lint code
pnpm run lint

# Fix linting issues
pnpm run lint:fix
```

### VS Code Integration

1. Install the Biome VS Code extension
2. Add to your VS Code settings (.vscode/settings.json):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome",
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  }
}
```

### Pre-commit hook (optional)

To ensure code quality before commits:

```bash
# Install husky
pnpm add -D husky

# Setup husky
pnpm exec husky init

# Add pre-commit hook
echo "pnpm run check" > .husky/pre-commit
```

## Project Structure

```
nestjs-boilerplate/
├── src/
│   ├── auth/          # Authentication module
│   ├── users/         # Users module
│   ├── todos/         # Todos module
│   ├── common/        # Common utilities, guards, interceptors
│   ├── config/        # Configuration files
│   ├── database/      # Database configuration and migrations
│   └── main.ts        # Application entry point
├── test/              # Test files
├── docker-compose.yml # Docker configuration
├── biome.json         # Biome configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Project dependencies
```

## Available Scripts

- `pnpm run start:dev` - Start in development mode with hot reload
- `pnpm run build` - Build for production
- `pnpm run start:prod` - Start in production mode
- `pnpm run check` - Run Biome check (format + lint)
- `pnpm run format` - Format code with Biome
- `pnpm run lint` - Lint code with Biome
- `pnpm run lint:fix` - Fix linting issues
- `pnpm run test` - Run unit tests
- `pnpm run test:e2e` - Run e2e tests

## API Documentation

Postman collection is available at `./postman/collection.json` after setup.

## License

MIT
