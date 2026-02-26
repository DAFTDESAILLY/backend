import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Req,
    Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AtGuard } from '../../common/guards/at.guard';
import { PlanningsService } from './plannings.service';
import { PdfGeneratorService } from '../../exports/pdf-generator.service';
import { DocxGeneratorService } from '../../exports/docx-generator.service';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { PlanningFilterDto } from './dto/planning-filter.dto';

@Controller('plannings')
@UseGuards(AtGuard)
export class PlanningsController {
    constructor(
        private readonly planningsService: PlanningsService,
        private readonly pdfService: PdfGeneratorService,
        private readonly docxService: DocxGeneratorService,
    ) { }

    @Post()
    async create(@Req() req: any, @Body() createDto: CreatePlanningDto) {
        return await this.planningsService.create(req.user.sub, createDto);
    }

    @Get()
    async findAll(@Req() req: any, @Query() filters: PlanningFilterDto) {
        return await this.planningsService.findAll(req.user.sub, filters);
    }

    @Get(':id')
    async findOne(@Req() req: any, @Param('id') id: number) {
        return await this.planningsService.findOne(id, req.user.sub);
    }

    @Put(':id')
    async update(
        @Req() req: any,
        @Param('id') id: number,
        @Body() updateDto: UpdatePlanningDto,
    ) {
        return await this.planningsService.update(id, req.user.sub, updateDto);
    }

    @Delete(':id')
    async remove(@Req() req: any, @Param('id') id: number) {
        await this.planningsService.remove(id, req.user.sub);
        return { message: 'Planeación eliminada correctamente' };
    }

    @Get(':id/export/pdf')
    async exportPdf(
        @Req() req: any,
        @Param('id') id: number,
        @Res() res: Response,
    ) {
        const planning = await this.planningsService.findOne(id, req.user.sub);
        const pdfBuffer = await this.pdfService.generate(planning);

        const filename = `Planeacion_${planning.materia?.name || 'General'}_${planning.fecha_inicio
            }-${planning.fecha_fin}.pdf`;

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': pdfBuffer.length,
        });

        res.send(pdfBuffer);
    }

    @Get(':id/export/docx')
    async exportDocx(
        @Req() req: any,
        @Param('id') id: number,
        @Res() res: Response,
    ) {
        const planning = await this.planningsService.findOne(id, req.user.sub);
        const docxBuffer = await this.docxService.generate(planning);

        const filename = `Planeacion_${planning.materia?.name || 'General'}_${planning.fecha_inicio
            }-${planning.fecha_fin}.docx`;

        res.set({
            'Content-Type':
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': docxBuffer.length,
        });

        res.send(docxBuffer);
    }
}
