import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AcademicPeriodsService } from './academic-periods.service';
import { CreateAcademicPeriodDto } from './dto/create-academic-period.dto';
import { UpdateAcademicPeriodDto } from './dto/update-academic-period.dto';

@Controller('academic-periods')
export class AcademicPeriodsController {
    constructor(private readonly academicPeriodsService: AcademicPeriodsService) { }

    @Post()
    create(@Body() createAcademicPeriodDto: CreateAcademicPeriodDto) {
        return this.academicPeriodsService.create(createAcademicPeriodDto);
    }

    @Get()
    findAll() {
        return this.academicPeriodsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.academicPeriodsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAcademicPeriodDto: UpdateAcademicPeriodDto) {
        return this.academicPeriodsService.update(+id, updateAcademicPeriodDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.academicPeriodsService.remove(+id);
    }
}
