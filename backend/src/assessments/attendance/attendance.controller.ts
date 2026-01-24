import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post()
    create(@Body() createDto: CreateAttendanceDto) {
        return this.attendanceService.create(createDto);
    }

    @Get()
    findAll() {
        return this.attendanceService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.attendanceService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateAttendanceDto) {
        return this.attendanceService.update(+id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.attendanceService.remove(+id);
    }
}
