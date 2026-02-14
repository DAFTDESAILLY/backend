import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.usersRepository.create(createUserDto);
        // Password hashing should be done here or in subscriber. 
        // Doing it here for simplicity.
        if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
        }
        return this.usersRepository.save(user);
    }

    findAll() {
        return this.usersRepository.find();
    }

    findOne(id: number) {
        return this.usersRepository.findOne({ where: { id } });
    }

    findByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        await this.usersRepository.update(id, updateUserDto);
        return this.findOne(id);
    }

    async updateRefreshToken(id: number, hashedRefreshToken: string | null) {
        await this.usersRepository.update(id, { hashedRefreshToken });
    }

    async updateLastActivity(id: number) {
        await this.usersRepository.update(id, { lastActivityAt: new Date() });
    }

    remove(id: number) {
        return this.usersRepository.delete(id);
    }
}
