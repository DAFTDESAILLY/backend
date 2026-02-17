import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContextsService } from './contexts.service';
import { ContextsController } from './contexts.controller';
import { Context } from './entities/context.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Context])],
  controllers: [ContextsController],
  providers: [ContextsService],
})
export class ContextsModule {}
