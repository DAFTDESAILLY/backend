import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ContextsService } from './contexts.service';
import { CreateContextDto } from './dto/create-context.dto';
import { UpdateContextDto } from './dto/update-context.dto';

@Controller('contexts')
export class ContextsController {
    constructor(private readonly contextsService: ContextsService) { }

    @Post()
    create(@Body() createContextDto: CreateContextDto) {
        return this.contextsService.create(createContextDto);
    }

    @Get()
    findAll(@Req() req: any) {
        const userId = req.user['sub'];
        return this.contextsService.findAll(userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.contextsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateContextDto: UpdateContextDto) {
        return this.contextsService.update(+id, updateContextDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.contextsService.remove(+id);
    }
}
