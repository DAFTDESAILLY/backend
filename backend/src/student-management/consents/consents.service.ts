import { Injectable } from '@nestjs/common';
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

    create(createDto: CreateConsentDto) {
        return this.consentsRepository.save(createDto);
    }

    findAll() {
        return this.consentsRepository.find();
    }

    findOne(id: number) {
        return this.consentsRepository.findOne({ where: { id } });
    }

    update(id: number, updateDto: UpdateConsentDto) {
        return this.consentsRepository.update(id, updateDto);
    }

    remove(id: number) {
        return this.consentsRepository.delete(id);
    }
}
