import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards/at.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { JobsModule } from './jobs/jobs.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { ContextsModule } from './academic/contexts/contexts.module';
import { AcademicPeriodsModule } from './academic/academic-periods/academic-periods.module';
import { GroupsModule } from './academic/groups/groups.module';
import { SubjectsModule } from './academic/subjects/subjects.module';
import { StudentsModule } from './student-management/students/students.module';
import { StudentAssignmentsModule } from './student-management/student-assignments/student-assignments.module';
import { StudentRecordsModule } from './student-management/student-records/student-records.module';
import { ConsentsModule } from './student-management/consents/consents.module';
import { AttendanceModule } from './assessments/attendance/attendance.module';
import { EvaluationsModule } from './assessments/evaluations/evaluations.module';
import { GradesModule } from './assessments/grades/grades.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_DATABASE', 'school_db'),
        autoLoadEntities: true,
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    JobsModule,
    UsersModule,
    FilesModule,
    ContextsModule,
    AcademicPeriodsModule,
    GroupsModule,
    SubjectsModule,
    StudentsModule,
    StudentAssignmentsModule,
    StudentRecordsModule,
    ConsentsModule,
    AttendanceModule,
    EvaluationsModule,
    GradesModule,
    AuthModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule { }
