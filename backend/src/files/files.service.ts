import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(FileEntity)
        private filesRepository: Repository<FileEntity>,
    ) { }

    async create(createFileData: any): Promise<FileEntity> {
        // Enforce the default category if none provided
        const fileToSave = {
            ...createFileData,
            fileCategory: createFileData.fileCategory || 'material'
        };
        const newFile = this.filesRepository.create(fileToSave as Partial<FileEntity>);
        return await this.filesRepository.save(newFile);
    }

    findAll(userId: number) {
        return this.filesRepository.find({ where: { userId } });
    }

    findOne(id: number) {
        return this.filesRepository.findOne({ where: { id } });
    }

    update(id: number, updateFileDto: UpdateFileDto) {
        return this.filesRepository.update(id, updateFileDto);
    }

    remove(id: number) {
        return this.filesRepository.delete(id);
    }
}
