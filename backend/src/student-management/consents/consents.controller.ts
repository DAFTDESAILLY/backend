import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, BadRequestException, Req } from '@nestjs/common';
import { ConsentsService } from './consents.service';
import { CreateConsentDto } from './dto/create-consent.dto';
import { UpdateConsentDto } from './dto/update-consent.dto';

@Controller('consents')
export class ConsentsController {
    constructor(private readonly consentsService: ConsentsService) { }

    @Post()
    create(@Body() createDto: CreateConsentDto) {
        return this.consentsService.create(createDto);
    }

    @Get()
    findAll(@Req() req: any) {
        const userId = req.user['sub'];
        return this.consentsService.findAll(userId);
    }

    // ✅ CORREGIDO - Usa ParseIntPipe para validar
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.consentsService.findOne(id);
    }

    // ✅ CORREGIDO - Usa ParseIntPipe para validar
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateConsentDto) {
        return this.consentsService.update(id, updateDto);
    }

    // ✅ CORREGIDO - Usa ParseIntPipe para validar
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.consentsService.remove(id);
    }
}