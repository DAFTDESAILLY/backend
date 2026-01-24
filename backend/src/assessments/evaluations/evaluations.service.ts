import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { EvaluationItem } from './entities/evaluation-item.entity';

@Injectable()
export class EvaluationsService {
    constructor(
        @InjectRepository(EvaluationItem)
        private itemsRepository: Repository<EvaluationItem>,
    ) { }

    create(createDto: CreateEvaluationDto) {
        return this.itemsRepository.save(createDto);
    }

    findAll() {
        return this.itemsRepository.find();
    }

    findOne(id: number) {
        return this.itemsRepository.findOne({ where: { id } });
    }

    update(id: number, updateDto: UpdateEvaluationDto) {
        return this.itemsRepository.update(id, updateDto);
    }

    remove(id: number) {
        return this.itemsRepository.delete(id);
    }
}
