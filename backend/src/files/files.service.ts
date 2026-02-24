import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileEntity } from './entities/file.entity';
import { FolderEntity } from './entities/folder.entity';

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(FileEntity)
        private filesRepository: Repository<FileEntity>,
        @InjectRepository(FolderEntity)
        private foldersRepository: Repository<FolderEntity>,
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

    // --- FOLDER OPERATIONS ---
    async createFolder(createFolderData: any, userId: number): Promise<FolderEntity> {
        const folder = this.foldersRepository.create(Object.assign({}, createFolderData, { userId }));
        return (await this.foldersRepository.save(folder)) as any;
    }

    async findFolders(userId: number) {
        let folders = await this.foldersRepository.find({ where: { userId } });

        // Ensure default system folders exist
        const defaultNames = ['Documentos Administrativos', 'Material Educativo'];
        let updated = false;

        for (const name of defaultNames) {
            if (!folders.some(f => f.name === name)) {
                const newFolder = this.foldersRepository.create({ name, userId });
                await this.foldersRepository.save(newFolder);
                updated = true;
            }
        }

        if (updated) {
            folders = await this.foldersRepository.find({ where: { userId } });
        }

        return folders;
    }

    async removeFolder(id: number) {
        const folder = await this.foldersRepository.findOne({ where: { id } });
        if (folder && ['Documentos Administrativos', 'Material Educativo'].includes(folder.name)) {
            throw new HttpException('No se pueden eliminar las carpetas por defecto del sistema', HttpStatus.BAD_REQUEST);
        }
        return this.foldersRepository.delete(id);
    }
}
