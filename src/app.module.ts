import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';

// Root module of the application
// import - Import other modules to use their functionality
// controllers -  Classes that handle incoming HTTP requests and return responses
// providers - Classes that contain business logic, database access, external APIs, etc.

@Module({
  imports: [AuthModule, UsersModule, TodosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
