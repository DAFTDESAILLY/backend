import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Controller('subjects')
export class SubjectsController {
    constructor(private readonly subjectsService: SubjectsService) { }

    @Post()
    create(@Body() createSubjectDto: CreateSubjectDto) {
        return this.subjectsService.create(createSubjectDto);
    }

    @Get()
    findAll(@Req() req: any) {
        const userId = req.user['sub'];
        return this.subjectsService.findAll(userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.subjectsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
        return this.subjectsService.update(+id, updateSubjectDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.subjectsService.remove(+id);
    }
}
