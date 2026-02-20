import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { SubjectsService } from '../subjects/subjects.service';

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(Group)
        private groupsRepository: Repository<Group>,
        private subjectsService: SubjectsService,
    ) { }

    async create(createGroupDto: CreateGroupDto) {
        const group = await this.groupsRepository.save(createGroupDto);
        // Regla: Se crea automáticamente la materia "General" al crear un grupo
        await this.subjectsService.create({
            groupId: group.id,
            name: 'General',
            isGeneral: true,
        });
        return group;
    }

    findAll(userId: number) {
        return this.groupsRepository.find({
            where: {
                academicPeriod: {
                    context: {
                        userId
                    }
                }
            },
            relations: ['academicPeriod', 'academicPeriod.context']
        });
    }

    findOne(id: number) {
        return this.groupsRepository.findOne({ where: { id } });
    }

    update(id: number, updateGroupDto: UpdateGroupDto) {
        return this.groupsRepository.update(id, updateGroupDto);
    }

    remove(id: number) {
        return this.groupsRepository.delete(id);
    }
}
