import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
    findAll() {
        return this.gradesService.findAll();
    }

    @Get('by-evaluation/:evaluationItemId')
    findByEvaluation(@Param('evaluationItemId') evaluationItemId: string) {
        return this.gradesService.findByEvaluation(+evaluationItemId);
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
