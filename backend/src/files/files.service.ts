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

    create(createFileDto: CreateFileDto) {
        return this.filesRepository.save(createFileDto);
    }

    findAll() {
        return this.filesRepository.find();
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
