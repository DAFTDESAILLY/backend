import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Controller('grades')
export class GradesController {
    constructor(private readonly gradesService: GradesService) { }

    @Post()
    create(@Body() createDto: CreateGradeDto) {
        return this.gradesService.create(createDto);
    }

    @Post('batch')
    createBatch(@Body() createDto: CreateGradeDto[]) {
        return this.gradesService.createBatch(createDto);
    }

    @Get()
    findAll(@Req() req: any) {
        const userId = req.user['sub'];
        return this.gradesService.findAll(userId);
    }

    @Get('student-assignment/:id')
    findByStudentAssignment(@Param('id') id: string) {
        return this.gradesService.findByStudentAssignment(+id);
    }

    @Get('student-assignment/:id/average')
    getStudentAssignmentAverage(@Param('id') id: string, @Query('subjectId') subjectId?: string) {
        return this.gradesService.calculateStudentAverage(+id, subjectId ? +subjectId : undefined);
    }

    @Get('evaluation-item/:id')
    findByEvaluationItem(@Param('id') id: string) {
        return this.gradesService.findByEvaluationItem(+id);
    }

    @Get('subject/:subjectId/averages')
    getSubjectAverages(@Param('subjectId') subjectId: string) {
        return this.gradesService.calculateSubjectAverages(+subjectId);
    }

    @Get('group/:groupId/averages')
    getGroupAverages(@Param('groupId') groupId: string) {
        return this.gradesService.calculateGroupAverages(+groupId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.gradesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateGradeDto) {
        return this.gradesService.update(+id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.gradesService.remove(+id);
    }
}
