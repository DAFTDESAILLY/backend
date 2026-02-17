import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { EvaluationItem } from './entities/evaluation-item.entity';
import { Subject } from '../../academic/subjects/entities/subject.entity';

@Injectable()
export class EvaluationsService {
  constructor(
    @InjectRepository(EvaluationItem)
    private itemsRepository: Repository<EvaluationItem>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  async create(createDto: CreateEvaluationDto) {
    if (!createDto.academicPeriodId) {
      const subject = await this.subjectRepository.findOne({
        where: { id: createDto.subjectId },
        relations: ['group'],
      });

      if (!subject) {
        throw new NotFoundException(
          `Subject with ID ${createDto.subjectId} not found`,
        );
      }

      if (!subject.group) {
        throw new BadRequestException(
          `Subject ${createDto.subjectId} does not belong to a group`,
        );
      }

      createDto.academicPeriodId = subject.group.academicPeriodId;
    }

    const evaluation = this.itemsRepository.create({
      ...createDto,
      dueDate: createDto.dueDate ? new Date(createDto.dueDate) : undefined,
    });

    return this.itemsRepository.save(evaluation);
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
