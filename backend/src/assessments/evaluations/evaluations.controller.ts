import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

@Controller('evaluations')
export class EvaluationsController {
    constructor(private readonly evaluationsService: EvaluationsService) { }

    @Post()
    create(@Body() createDto: CreateEvaluationDto) {
        return this.evaluationsService.create(createDto);
    }

    @Get()
    findAll(@Req() req: any) {
        const userId = req.user['sub'];
        return this.evaluationsService.findAll(userId);
    }

    @Get('subject/:subjectId')
    findBySubject(@Param('subjectId') subjectId: string) {
        return this.evaluationsService.findBySubject(+subjectId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.evaluationsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateEvaluationDto) {
        return this.evaluationsService.update(+id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.evaluationsService.remove(+id);
    }
}
