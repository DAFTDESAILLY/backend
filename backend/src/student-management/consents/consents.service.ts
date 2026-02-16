import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConsentDto } from './dto/create-consent.dto';
import { UpdateConsentDto } from './dto/update-consent.dto';
import { StudentShareConsent } from './entities/student-share-consent.entity';

@Injectable()
export class ConsentsService {
    constructor(
        @InjectRepository(StudentShareConsent)
        private consentsRepository: Repository<StudentShareConsent>,
    ) { }

    async create(createDto: CreateConsentDto) {
        const consent = this.consentsRepository.create(createDto);
        return this.consentsRepository.save(consent);
    }

    async findAll() {
        return this.consentsRepository.find({
            relations: ['student'], // Si quieres cargar relaciones
        });
    }

    async findOne(id: number) {
        const consent = await this.consentsRepository.findOne({
            where: { id },
            relations: ['student'] // Opcional: cargar relaciones
        });

        if (!consent) {
            throw new NotFoundException(`Consent with ID ${id} not found`);
        }

        return consent;
    }

    async update(id: number, updateDto: UpdateConsentDto) {
        // Verificar que existe antes de actualizar
        await this.findOne(id);

        await this.consentsRepository.update(id, updateDto);
        return this.findOne(id);
    }

    async remove(id: number) {
        // Verificar que existe antes de eliminar
        const consent = await this.findOne(id);

        await this.consentsRepository.delete(id);
        return { deleted: true, consent };
    }
}