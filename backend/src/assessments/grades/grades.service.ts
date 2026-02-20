import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';
import { StudentAssignment } from '../../student-management/student-assignments/entities/student-assignment.entity';
import { EvaluationItem } from '../evaluations/entities/evaluation-item.entity';
import { Subject } from '../../academic/subjects/entities/subject.entity';
import { Group } from '../../academic/groups/entities/group.entity';

@Injectable()
export class GradesService {
    constructor(
        @InjectRepository(Grade)
        private gradesRepository: Repository<Grade>,
        @InjectRepository(StudentAssignment)
        private studentAssignmentRepository: Repository<StudentAssignment>,
        @InjectRepository(EvaluationItem)
        private evaluationItemRepository: Repository<EvaluationItem>,
        @InjectRepository(Subject)
        private subjectRepository: Repository<Subject>,
        @InjectRepository(Group)
        private groupRepository: Repository<Group>,
    ) { }

    async create(createDto: CreateGradeDto) {
        // Verificar si ya existe una calificación para esta combinación
        const existingGrade = await this.gradesRepository.findOne({
            where: {
                evaluationItemId: createDto.evaluationItemId,
                studentAssignmentId: createDto.studentAssignmentId
            }
        });

        if (existingGrade) {
            // Actualizar la calificación existente en lugar de lanzar error
            await this.gradesRepository.update(existingGrade.id, {
                score: createDto.score,
                feedback: createDto.feedback
            });
            const result = await this.gradesRepository.findOne({ where: { id: existingGrade.id } });
            await this.updateEvaluationStatus(createDto.evaluationItemId);
            return result;
        }

        const saved = await this.gradesRepository.save(createDto);
        await this.updateEvaluationStatus(createDto.evaluationItemId);
        return saved;
    }

    async createBatch(createGradesDto: CreateGradeDto[]) {
        // Validar que todos tengan studentAssignmentId
        for (const dto of createGradesDto) {
            if (!dto.studentAssignmentId) {
                throw new BadRequestException(
                    `Missing studentAssignmentId for evaluation item ${dto.evaluationItemId}`
                );
            }
        }

        const results: Grade[] = [];
        const evaluationItemIds = new Set<number>();

        // Procesar cada calificación (crear o actualizar)
        for (const dto of createGradesDto) {
            evaluationItemIds.add(dto.evaluationItemId);
            const existing = await this.gradesRepository.findOne({
                where: {
                    evaluationItemId: dto.evaluationItemId,
                    studentAssignmentId: dto.studentAssignmentId
                }
            });

            if (existing) {
                // Actualizar calificación existente
                await this.gradesRepository.update(existing.id, {
                    score: dto.score,
                    feedback: dto.feedback || null
                });
                const updated = await this.gradesRepository.findOne({ where: { id: existing.id } });
                if (updated) results.push(updated);
            } else {
                // Crear nueva calificación
                const newGrade = this.gradesRepository.create({
                    studentAssignment: { id: dto.studentAssignmentId },
                    evaluationItem: { id: dto.evaluationItemId },
                    score: dto.score,
                    feedback: dto.feedback || null,
                });
                const saved = await this.gradesRepository.save(newGrade);
                results.push(saved);
            }
        }

        // Actualizar estados de evaluaciones afectadas
        for (const id of evaluationItemIds) {
            await this.updateEvaluationStatus(id);
        }

        return results;
    }

    findAll(userId: number) {
        return this.gradesRepository.find({
            where: {
                studentAssignment: {
                    group: {
                        academicPeriod: {
                            context: {
                                userId
                            }
                        }
                    }
                }
            },
            relations: ['evaluationItem', 'studentAssignment', 'studentAssignment.student']
        });
    }

    findByStudentAssignment(studentAssignmentId: number) {
        return this.gradesRepository.find({
            where: { studentAssignmentId },
            relations: ['evaluationItem'],
        });
    }

    findByEvaluationItem(evaluationItemId: number) {
        return this.gradesRepository.find({
            where: { evaluationItemId },
            relations: ['studentAssignment', 'studentAssignment.student'],
        });
    }

    findOne(id: number) {
        return this.gradesRepository.findOne({ where: { id } });
    }

    async update(id: number, updateDto: UpdateGradeDto) {
        const result = await this.gradesRepository.update(id, updateDto);
        const grade = await this.gradesRepository.findOne({ where: { id } });
        if (grade) {
            await this.updateEvaluationStatus(grade.evaluationItemId);
        }
        return result;
    }

    async remove(id: number) {
        const grade = await this.gradesRepository.findOne({ where: { id } });
        const result = await this.gradesRepository.delete(id);
        if (grade) {
            await this.updateEvaluationStatus(grade.evaluationItemId);
        }
        return result;
    }

    private async updateEvaluationStatus(evaluationItemId: number) {
        const evaluation = await this.evaluationItemRepository.findOne({
            where: { id: evaluationItemId },
            relations: ['subject']
        });

        if (!evaluation) return;

        // Obtener el grupo a través de la materia
        const subject = await this.subjectRepository.findOne({
            where: { id: evaluation.subjectId },
            relations: ['group']
        });

        if (!subject || !subject.groupId) return;

        // Contar estudiantes activos en el grupo
        const totalStudents = await this.studentAssignmentRepository.count({
            where: {
                groupId: subject.groupId,
                status: 'active'
            }
        });

        // Contar cuantas calificaciones existen para esta evaluación
        const totalGrades = await this.gradesRepository.count({
            where: { evaluationItemId }
        });

        const newStatus = totalGrades >= totalStudents ? 'completed' : 'pending';

        if (evaluation.status !== newStatus) {
            await this.evaluationItemRepository.update(evaluationItemId, { status: newStatus });
        }
    }

    /**
     * Calcula el promedio de calificaciones para un estudiante en una materia específica
     * o en todas las materias de su asignación de grupo.
     * Soporta de 1 a N evaluaciones dinámicamente.
     */
    async calculateStudentAverage(studentAssignmentId: number, subjectId?: number) {
        let queryBuilder = this.gradesRepository
            .createQueryBuilder('grade')
            .leftJoinAndSelect('grade.evaluationItem', 'evaluationItem')
            .where('grade.studentAssignmentId = :studentAssignmentId', { studentAssignmentId });

        if (subjectId) {
            queryBuilder.andWhere('evaluationItem.subjectId = :subjectId', { subjectId });
        }

        const grades = await queryBuilder.getMany();

        if (grades.length === 0) {
            return {
                studentAssignmentId,
                subjectId,
                average: null,
                totalGrades: 0,
                message: 'No hay calificaciones registradas'
            };
        }

        let simpleAverage = 0;
        let finalAverage = 0;
        let weightedAverage: number | null = null;

        // 1. Obtener la configuración de la materia si existe
        let gradingScale: Record<string, number> | null = null;
        if (subjectId) {
            const subject = await this.subjectRepository.findOne({ where: { id: subjectId } });
            gradingScale = subject?.gradingScale || null;
        } else if (grades.length > 0) {
            // Si no se pasó subjectId, intentamos obtenerlo del primer item
            const subjectIdFromItem = grades[0].evaluationItem?.subjectId;
            if (subjectIdFromItem) {
                const subject = await this.subjectRepository.findOne({ where: { id: subjectIdFromItem } });
                gradingScale = subject?.gradingScale || null;
            }
        }

        // 2. Calcular promedio simple (fallback)
        const totalScore = grades.reduce((sum, grade) => sum + Number(grade.score), 0);
        simpleAverage = Number((totalScore / grades.length).toFixed(2));

        // 3. Calcular promedio según escala configurada
        if (gradingScale && Object.keys(gradingScale).length > 0) {
            const typeAverages: Record<string, { sum: number; count: number }> = {};

            // Agrupar por tipo
            grades.forEach(grade => {
                const type = grade.evaluationItem?.type;
                if (type && gradingScale![type]) {
                    if (!typeAverages[type]) {
                        typeAverages[type] = { sum: 0, count: 0 };
                    }
                    typeAverages[type].sum += Number(grade.score);
                    typeAverages[type].count++;
                }
            });

            // Calcular promedio por tipo y aplicar peso
            let totalWeightedScore = 0;
            let totalWeightUsed = 0;

            for (const type in typeAverages) {
                const avg = typeAverages[type].sum / typeAverages[type].count;
                const weight = gradingScale[type];
                totalWeightedScore += avg * (weight / 100);
                totalWeightUsed += weight;
            }

            // Normalizar si no se cubren todos los criterios (e.g. solo hay tareas pero no exámenes)
            if (totalWeightUsed > 0) {
                // Si queremos que sea sobre el 100% de lo entregado:
                // finalAverage = (totalWeightedScore * 100) / totalWeightUsed;

                // Si queremos que "pierda" puntos por lo no entregado (más estricto):
                finalAverage = totalWeightedScore; // Esto asume que la suma de weights es 100

                // Usaremos la lógica estricta (sumar lo que tiene). Pero si se prefiere re-escalar:
                finalAverage = Number(finalAverage.toFixed(2));
                weightedAverage = finalAverage;
            } else {
                finalAverage = simpleAverage;
            }

        } else {
            // Lógica anterior de pesos individuales de items
            const hasWeights = grades.every(g => g.evaluationItem?.weight != null);

            if (hasWeights) {
                const totalWeight = grades.reduce((sum, grade) => sum + Number(grade.evaluationItem.weight), 0);

                if (totalWeight > 0) {
                    const weightedSum = grades.reduce((sum, grade) => {
                        const weight = Number(grade.evaluationItem.weight);
                        const score = Number(grade.score);
                        const maxScore = Number(grade.evaluationItem.maxScore || 100);
                        const normalizedScore = (score / maxScore) * 100;
                        return sum + (normalizedScore * weight / 100);
                    }, 0);

                    weightedAverage = (weightedSum / totalWeight) * 100;
                    finalAverage = Number(weightedAverage.toFixed(2));
                } else {
                    finalAverage = simpleAverage;
                }
            } else {
                finalAverage = simpleAverage;
            }
        }

        return {
            studentAssignmentId,
            subjectId,
            totalGrades: grades.length,
            simpleAverage: simpleAverage,
            weightedAverage: weightedAverage ? Number(weightedAverage.toFixed(2)) : null,
            average: Number(finalAverage.toFixed(2)), // Prioridad: Escala > Pesos Items > Simple
            gradingScale: gradingScale, // Return scale for UI debugging
            grades: grades.map(g => ({
                id: g.id,
                evaluationItemId: g.evaluationItemId,
                evaluationName: g.evaluationItem?.name,
                type: g.evaluationItem?.type,
                score: Number(g.score),
                maxScore: Number(g.evaluationItem?.maxScore || 100),
                weight: g.evaluationItem?.weight ? Number(g.evaluationItem.weight) : null
            }))
        };
    }

    /**
     * Calcula los promedios de todos los estudiantes en una materia específica.
     * Eficiente incluso con 1000+ evaluaciones por estudiante.
     */
    async calculateSubjectAverages(subjectId: number) {
        // Verificar que la materia existe
        const subject = await this.subjectRepository.findOne({
            where: { id: subjectId },
            relations: ['group']
        });

        if (!subject) {
            throw new NotFoundException(`Materia con ID ${subjectId} no encontrada`);
        }

        // Obtener todas las calificaciones de la materia
        const grades = await this.gradesRepository.find({
            where: {
                evaluationItem: {
                    subjectId: subjectId
                }
            },
            relations: ['evaluationItem', 'studentAssignment', 'studentAssignment.student']
        });

        // Agrupar calificaciones por estudiante
        const studentsMap = new Map<number, Grade[]>();
        const studentInfoMap = new Map<number, any>();

        grades.forEach(grade => {
            const studentId = grade.studentAssignment.studentId;
            if (!studentsMap.has(studentId)) {
                studentsMap.set(studentId, []);
                studentInfoMap.set(studentId, grade.studentAssignment.student);
            }
            studentsMap.get(studentId)?.push(grade);
        });

        // Calcular promedios para cada estudiante
        const averages = Array.from(studentsMap.entries()).map(([studentId, studentGrades]) => {
            const student = studentInfoMap.get(studentId);

            // Lógica de cálculo (reutilizada de calculateStudentAverage pero simplificada)
            let finalAverage = 0;
            const simpleAverage = studentGrades.reduce((sum, g) => sum + Number(g.score), 0) / studentGrades.length;

            if (subject.gradingScale && Object.keys(subject.gradingScale).length > 0) {
                const typeAverages: Record<string, { sum: number; count: number }> = {};

                studentGrades.forEach(grade => {
                    const type = grade.evaluationItem?.type;
                    if (type && subject.gradingScale![type]) {
                        if (!typeAverages[type]) typeAverages[type] = { sum: 0, count: 0 };
                        typeAverages[type].sum += Number(grade.score);
                        typeAverages[type].count++;
                    }
                });

                let totalWeightedScore = 0;
                let totalWeightUsed = 0;

                for (const type in typeAverages) {
                    const avg = typeAverages[type].sum / typeAverages[type].count;
                    const weight = subject.gradingScale[type];
                    totalWeightedScore += avg * (weight / 100);
                    totalWeightUsed += weight;
                }

                if (totalWeightUsed > 0) {
                    finalAverage = totalWeightedScore; // Strict: sum only what they have
                } else {
                    finalAverage = simpleAverage;
                }
            } else {
                // Fallback to simple average or item weights if needed (keeping simple for now as reliable fallback)
                // If specific item weights are needed, logic would go here.
                // checking for item level weights
                const hasWeights = studentGrades.every(g => g.evaluationItem?.weight != null);
                if (hasWeights) {
                    const totalWeight = studentGrades.reduce((sum, g) => sum + Number(g.evaluationItem.weight), 0);
                    if (totalWeight > 0) {
                        const weightedSum = studentGrades.reduce((sum, g) => {
                            const w = Number(g.evaluationItem.weight);
                            const s = Number(g.score);
                            const max = Number(g.evaluationItem.maxScore || 100);
                            return sum + ((s / max) * 100 * w / 100);
                        }, 0);
                        finalAverage = (weightedSum / totalWeight) * 100;
                    } else {
                        finalAverage = simpleAverage;
                    }
                } else {
                    finalAverage = simpleAverage;
                }
            }

            return {
                studentId: student.id,
                studentName: student.fullName,
                average: Number(finalAverage.toFixed(2)),
                totalGrades: studentGrades.length
            };
        });

        const validAverages = averages.filter(a => a.average !== null);

        return {
            subjectId,
            subjectName: subject.name,
            groupId: subject.groupId,
            students: averages,
            classAverage: validAverages.length > 0
                ? Number((validAverages.reduce((sum, a) => sum + a.average, 0) / validAverages.length).toFixed(2))
                : null
        };
    }

    /**
     * Calcula los promedios de todos los estudiantes en todas las materias de un grupo.
     * Maneja eficientemente múltiples materias y evaluaciones.
     */
    async calculateGroupAverages(groupId: number) {
        // Verificar que el grupo existe
        const group = await this.groupRepository.findOne({
            where: { id: groupId },
            relations: ['subjects']
        });

        if (!group) {
            throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
        }

        // Obtener todas las asignaciones de estudiantes del grupo
        const studentAssignments = await this.studentAssignmentRepository.find({
            where: {
                groupId: groupId,
                status: 'active'
            },
            relations: ['student']
        });

        // Para cada estudiante, calcular su promedio en cada materia
        const studentAverages = await Promise.all(
            studentAssignments.map(async (assignment) => {
                const subjectAverages = await Promise.all(
                    group.subjects.map(async (subject) => {
                        const result = await this.gradesRepository
                            .createQueryBuilder('grade')
                            .leftJoin('grade.evaluationItem', 'evaluationItem')
                            .where('grade.studentAssignmentId = :studentAssignmentId', {
                                studentAssignmentId: assignment.id
                            })
                            .andWhere('evaluationItem.subjectId = :subjectId', {
                                subjectId: subject.id
                            })
                            .select('AVG(grade.score)', 'average')
                            .addSelect('COUNT(grade.id)', 'count')
                            .getRawOne();

                        return {
                            subjectId: subject.id,
                            subjectName: subject.name,
                            average: result.average ? Number(Number(result.average).toFixed(2)) : null,
                            totalGrades: Number(result.count)
                        };
                    })
                );

                // Calcular promedio general del estudiante (promedio de promedios de materias)
                const validAverages = subjectAverages.filter(s => s.average !== null);
                const generalAverage = validAverages.length > 0
                    ? Number((validAverages.reduce((sum, s) => sum + (s.average as number), 0) / validAverages.length).toFixed(2))
                    : null;

                return {
                    studentAssignmentId: assignment.id,
                    studentId: assignment.studentId,
                    studentName: assignment.student.fullName,
                    subjectAverages,
                    generalAverage
                };
            })
        );

        return {
            groupId,
            groupName: group.name,
            totalStudents: studentAverages.length,
            students: studentAverages
        };
    }
}
