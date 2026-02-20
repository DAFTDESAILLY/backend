import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContextDto } from './dto/create-context.dto';
import { UpdateContextDto } from './dto/update-context.dto';
import { Context } from './entities/context.entity';

@Injectable()
export class ContextsService {
    constructor(
        @InjectRepository(Context)
        private contextsRepository: Repository<Context>,
    ) { }

    create(createContextDto: CreateContextDto) {
        return this.contextsRepository.save(createContextDto);
    }

    findAll(userId: number) {
        return this.contextsRepository.find({
            where: { userId }
        });
    }

    findOne(id: number) {
        return this.contextsRepository.findOne({ where: { id } });
    }

    update(id: number, updateContextDto: UpdateContextDto) {
        return this.contextsRepository.update(id, updateContextDto);
    }

    remove(id: number) {
        return this.contextsRepository.delete(id);
    }
}
