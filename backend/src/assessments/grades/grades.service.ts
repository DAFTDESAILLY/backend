import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';

@Injectable()
export class GradesService {
    constructor(
        @InjectRepository(Grade)
        private gradesRepository: Repository<Grade>,
    ) { }

    create(createDto: CreateGradeDto) {
        return this.gradesRepository.save(createDto);
    }

    async createBatch(createDto: CreateGradeDto[] | any) {
        // Handle both array directly and wrapped in object
        let dtoArray: CreateGradeDto[];

        if (Array.isArray(createDto)) {
            dtoArray = createDto;
        } else if (createDto && Array.isArray(createDto.grades)) {
            dtoArray = createDto.grades;
        } else {
            // If it's a single object, wrap it in an array
            dtoArray = [createDto];
        }

        const results: Grade[] = [];

        for (const dto of dtoArray) {
            // Try to find existing grade
            const existing = await this.gradesRepository.findOne({
                where: {
                    evaluationItemId: dto.evaluationItemId,
                    studentAssignmentId: dto.studentAssignmentId
                }
            });

            if (existing) {
                // Update existing grade
                existing.score = dto.score;
                results.push(await this.gradesRepository.save(existing));
            } else {
                // Create new grade
                const grade = this.gradesRepository.create(dto);
                results.push(await this.gradesRepository.save(grade));
            }
        }

        return results;
    }

    findAll() {
        return this.gradesRepository.find();
    }

    findOne(id: number) {
        return this.gradesRepository.findOne({ where: { id } });
    }

    update(id: number, updateDto: UpdateGradeDto) {
        return this.gradesRepository.update(id, updateDto);
    }

    remove(id: number) {
        return this.gradesRepository.delete(id);
    }
}
