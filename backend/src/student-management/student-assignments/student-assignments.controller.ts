import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { StudentAssignmentsService } from './student-assignments.service';
import { CreateStudentAssignmentDto } from './dto/create-student-assignment.dto';
import { UpdateStudentAssignmentDto } from './dto/update-student-assignment.dto';

@Controller('student-assignments')
export class StudentAssignmentsController {
    constructor(private readonly studentAssignmentsService: StudentAssignmentsService) { }

    @Post()
    create(@Body() createStudentAssignmentDto: CreateStudentAssignmentDto) {
        return this.studentAssignmentsService.create(createStudentAssignmentDto);
    }

    @Get()
    findAll(@Req() req: any) {
        const userId = req.user['sub'];
        return this.studentAssignmentsService.findAll(userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.studentAssignmentsService.findOne(+id);
    }

    @Get('student/:studentId')
    findByStudent(@Param('studentId') studentId: string) {
        return this.studentAssignmentsService.findByStudent(+studentId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateStudentAssignmentDto: UpdateStudentAssignmentDto) {
        return this.studentAssignmentsService.update(+id, updateStudentAssignmentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.studentAssignmentsService.remove(+id);
    }
}
