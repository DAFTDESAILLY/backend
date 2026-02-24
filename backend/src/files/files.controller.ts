import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, Res, NotFoundException } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import type { Response } from 'express';

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('folderId') folderId: string, @Req() req: any) {
        if (!file) {
            throw new NotFoundException('No file uploaded');
        }

        const userId = req.user['sub'];
        const metadata = {
            userId: userId,
            fileName: file.originalname,
            storageKey: file.filename, // Physical name in ./uploads
            fileType: file.originalname.split('.').pop()?.toLowerCase() || 'unknown',
            fileSize: file.size,
            fileCategory: 'material',
            folderId: folderId ? parseInt(folderId, 10) : null
        };

        const savedFile = await this.filesService.create(metadata);

        // Map correctly to frontend expectations
        const responseFile = {
            id: savedFile.id,
            name: savedFile.fileName,
            type: savedFile.fileType,
            size: savedFile.fileSize || 0,
            url: `/api/files/${savedFile.id}/download`,
            uploadedBy: savedFile.userId,
            folderId: savedFile.folderId,
            createdAt: savedFile.createdAt
        };

        return { message: 'File uploaded successfully', file: responseFile };
    }

    @Get(':id/download')
    async downloadFile(@Param('id') id: string, @Res() res: Response) {
        const fileRecord = await this.filesService.findOne(+id);
        if (!fileRecord) {
            throw new NotFoundException('File metadata not found in database');
        }

        const filePath = require('path').join(process.cwd(), 'uploads', fileRecord.storageKey);
        if (!fs.existsSync(filePath)) {
            throw new NotFoundException('Physical file not found on disk');
        }

        res.download(filePath, fileRecord.fileName);
    }

    @Post()
    create(@Body() createFileDto: CreateFileDto) {
        return this.filesService.create(createFileDto);
    }

    @Get()
    findAll(@Req() req: any) {
        const userId = req.user['sub'];
        return this.filesService.findAll(userId);
    }

    // --- FOLDERS ---
    @Post('folders')
    createFolder(@Body() createFolderDto: any, @Req() req: any) {
        const userId = req.user['sub'];
        return this.filesService.createFolder(createFolderDto, userId);
    }

    @Get('folders')
    findFolders(@Req() req: any) {
        const userId = req.user['sub'];
        return this.filesService.findFolders(userId);
    }

    @Delete('folders/:id')
    removeFolder(@Param('id') id: string) {
        return this.filesService.removeFolder(+id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.filesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
        return this.filesService.update(+id, updateFileDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.filesService.remove(+id);
    }
}
