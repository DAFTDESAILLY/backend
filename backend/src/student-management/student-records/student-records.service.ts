import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentRecordDto } from './dto/create-student-record.dto';
import { UpdateStudentRecordDto } from './dto/update-student-record.dto';
import { StudentRecord } from './entities/student-record.entity';
import { Context } from '../../academic/contexts/entities/context.entity';
import { Student } from '../students/entities/student.entity';
import { FilesService } from '../../files/files.service';
import * as fs from 'fs';
import * as path from 'path';
const PDFDocument = require('pdfkit');

@Injectable()
export class StudentRecordsService {
    constructor(
        @InjectRepository(StudentRecord)
        private recordsRepository: Repository<StudentRecord>,
        @InjectRepository(Context)
        private contextRepository: Repository<Context>,
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
        private filesService: FilesService,
    ) { }

    async create(createDto: CreateStudentRecordDto, userId: number) {
        try {
            // Validate existence
            const context = await this.contextRepository.findOne({ where: { id: createDto.contextId } });
            if (!context) {
                throw new NotFoundException(`Context with ID ${createDto.contextId} not found`);
            }

            const student = await this.studentRepository.findOne({ where: { id: createDto.studentId } });
            if (!student) {
                throw new NotFoundException(`Student with ID ${createDto.studentId} not found`);
            }

            // Limpiar la fecha para evitar error de MySQL "Incorrect date value"
            let formattedDate = createDto.date;
            if (formattedDate) {
                const dateObj = new Date(formattedDate);
                formattedDate = dateObj.toISOString().split('T')[0] as any;
            }

            const recordData = {
                ...createDto,
                date: formattedDate
            };

            const record = this.recordsRepository.create(recordData);
            const savedRecord = await this.recordsRepository.save(record);

            try {
                // -- GENERACIÓN DE REPORTE VÍA PDF --
                const fileName = `Reporte_${student.fullName.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pdf`;
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('') + '.pdf';
                const uploadPath = path.join(process.cwd(), 'uploads');

                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }

                const physicalPath = path.join(uploadPath, randomName);
                const doc = new PDFDocument({ margin: 50 });

                doc.pipe(fs.createWriteStream(physicalPath));

                // Título
                doc.fontSize(20).font('Helvetica-Bold').text('Reporte de Expediente', { align: 'center' });
                doc.moveDown();

                // Datos del Alumno
                doc.fontSize(12).font('Helvetica-Bold').text('Alumno: ', { continued: true }).font('Helvetica').text(student.fullName);
                doc.font('Helvetica-Bold').text('Matrícula/Folio: ', { continued: true }).font('Helvetica').text(student.enrollmentId || 'N/A');
                doc.font('Helvetica-Bold').text('Fecha del Evento: ', { continued: true }).font('Helvetica').text(createDto.date ? new Date(createDto.date).toLocaleDateString() : new Date().toLocaleDateString());
                doc.moveDown();

                // Datos del Evento
                doc.font('Helvetica-Bold').text('Asunto/Título: ', { continued: true }).font('Helvetica').text(createDto.title || 'Sin título');
                doc.font('Helvetica-Bold').text('Tipo: ', { continued: true }).font('Helvetica').text(createDto.type.toUpperCase());
                doc.moveDown();

                // Descripción
                doc.font('Helvetica-Bold').text('Descripción Detallada:');
                doc.moveDown(0.5);
                doc.font('Helvetica').text(createDto.description, { align: 'justify' });

                doc.end();

                // -- GUARDAR EN BASE DE DATOS COMO ARCHIVO --
                // Obtener carpeta "Documentos Administrativos"
                const folders = await this.filesService.findFolders(userId);
                let targetFolder = folders.find(f => f.name === 'Documentos Administrativos');

                if (!targetFolder) {
                    // Si por algún motivo no existía (no debería pasar por las correciones previas)
                    targetFolder = await this.filesService.createFolder({ name: 'Documentos Administrativos' }, userId);
                }

                // Registrar el archivo
                const stats = fs.statSync(physicalPath);
                await this.filesService.create({
                    userId: userId,
                    fileName: fileName,
                    storageKey: randomName,
                    fileType: 'pdf',
                    fileSize: stats.size,
                    fileCategory: 'material',
                    folderId: targetFolder.id
                });

            } catch (error) {
                console.error('Error al generar el PDF del expediente:', error);
                // Si el PDF falla, no detenemos la respuesta general del guardado del expediente, pero lo registramos.
            }

            return savedRecord;
        } catch (e) {
            throw new HttpException(`Detalle del Server Error: ${e.message} \nStack: ${e.stack}`, 500);
        }
    }

    findAll(userId: number, studentId?: number) {
        if (studentId) {
            return this.recordsRepository.find({
                where: { studentId },
                relations: ['context', 'student']
            });
        }

        return this.recordsRepository.find({
            where: { context: { userId } },
            relations: ['context', 'student']
        });
    }

    findOne(id: number) {
        return this.recordsRepository.findOne({ where: { id } });
    }

    update(id: number, updateDto: UpdateStudentRecordDto) {
        return this.recordsRepository.update(id, updateDto);
    }

    remove(id: number) {
        return this.recordsRepository.delete(id);
    }
}
