import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FileEntity } from './entities/file.entity';
import { FolderEntity } from './entities/folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity, FolderEntity])],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService]
})
export class FilesModule { }
