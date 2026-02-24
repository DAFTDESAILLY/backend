import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { StudentRecordsService } from './student-records.service';
import { CreateStudentRecordDto } from './dto/create-student-record.dto';
import { UpdateStudentRecordDto } from './dto/update-student-record.dto';

@Controller('student-records')
export class StudentRecordsController {
    constructor(private readonly recordsService: StudentRecordsService) { }

    @Post()
    create(@Body() createDto: CreateStudentRecordDto, @Req() req: any) {
        const userId = req.user['sub'];
        return this.recordsService.create(createDto, userId);
    }

    @Get()
    findAll(@Req() req: any, @Query('studentId') studentId?: string) {
        const userId = req.user['sub'];
        return this.recordsService.findAll(userId, studentId ? +studentId : undefined);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.recordsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateStudentRecordDto) {
        return this.recordsService.update(+id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.recordsService.remove(+id);
    }
}
