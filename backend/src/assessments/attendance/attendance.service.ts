import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private attendanceRepository: Repository<Attendance>,
    ) { }

    create(createDto: CreateAttendanceDto) {
        return this.attendanceRepository.save(createDto);
    }

    findAll() {
        return this.attendanceRepository.find();
    }

    findOne(id: number) {
        return this.attendanceRepository.findOne({ where: { id } });
    }

    update(id: number, updateDto: UpdateAttendanceDto) {
        return this.attendanceRepository.update(id, updateDto);
    }

    remove(id: number) {
        return this.attendanceRepository.delete(id);
    }
}
