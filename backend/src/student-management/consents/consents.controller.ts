import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
    findAll() {
        return this.consentsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.consentsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateConsentDto) {
        return this.consentsService.update(+id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.consentsService.remove(+id);
    }
}
