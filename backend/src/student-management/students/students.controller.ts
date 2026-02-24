import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @Post()
    create(@Body() createStudentDto: CreateStudentDto, @Req() req: any) {
        // Obtenemos el userId del token
        const userId = req.user ? req.user['sub'] : null;
        return this.studentsService.create(createStudentDto, userId);
    }

    @Get('group/:groupId')
    async getStudentsByGroup(@Param('groupId', ParseIntPipe) groupId: number) {
        return this.studentsService.getStudentsByGroup(groupId);
    }

    @Get()
    findAll(@Req() req: any) {
        const userId = req.user['sub'];
        return this.studentsService.findAll(userId);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.studentsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateStudentDto: UpdateStudentDto) {
        return this.studentsService.update(id, updateStudentDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.studentsService.remove(id);
    }
}
