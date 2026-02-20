import { Controller, Get, Post, Body, Patch, Param, Delete, ParseArrayPipe, Req, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post('batch')
    createBatch(
        @Body(new ParseArrayPipe({ items: CreateAttendanceDto })) createDtos: CreateAttendanceDto[],
        @Req() req: any
    ) {
        const userId = req.user['sub'];
        return this.attendanceService.createBatch(createDtos, userId);
    }

    @Post()
    create(@Body() createDto: CreateAttendanceDto | CreateAttendanceDto[], @Req() req: any) {
        const userId = req.user['sub'];
        if (Array.isArray(createDto)) {
            return this.attendanceService.createBatch(createDto, userId);
        }
        return this.attendanceService.create(createDto, userId);
    }

    @Get()
    findAll(
        @Req() req: any,
        @Query('groupId') groupId?: string,
        @Query('subjectId') subjectId?: string,
        @Query('studentId') studentId?: string,
        @Query('date') date?: string
    ) {
        const userId = req.user['sub'];
        
        // Build filters
        const filters: any = {};
        if (groupId) filters.groupId = +groupId;
        if (subjectId) filters.subjectId = +subjectId;
        if (studentId) filters.studentId = +studentId;
        if (date) filters.date = date;
        
        return this.attendanceService.findAll(userId, filters);
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
