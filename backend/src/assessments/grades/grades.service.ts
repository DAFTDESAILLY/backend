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
        console.log('📥 Recibiendo datos:', JSON.stringify(createDto, null, 2));
        
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

        console.log('📊 Procesando array de:', dtoArray.length, 'calificaciones');

        const results: Grade[] = [];
        const errors: any[] = [];

        for (const dto of dtoArray) {
            try {
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
                    if (dto.feedback !== undefined) {
                        existing.feedback = dto.feedback;
                    }
                    const updated = await this.gradesRepository.save(existing);
                    console.log('✅ Actualizada calificación ID:', updated.id);
                    results.push(updated);
                } else {
                    // Create new grade
                    const grade = this.gradesRepository.create(dto);
                    const created = await this.gradesRepository.save(grade);
                    console.log('✅ Creada nueva calificación ID:', created.id);
                    results.push(created);
                }
            } catch (error) {
                console.error('❌ Error procesando calificación:', error);
                errors.push({
                    dto,
                    error: error.message
                });
            }
        }

        if (errors.length > 0) {
            console.error('❌ Se encontraron errores:', errors);
        }

        console.log('✅ Total procesadas:', results.length, 'de', dtoArray.length);
        return results;
    }

    findAll() {
        return this.gradesRepository.find();
    }

    findByEvaluation(evaluationItemId: number) {
        return this.gradesRepository.find({
            where: { evaluationItemId },
            relations: ['studentAssignment', 'studentAssignment.student']
        });
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
