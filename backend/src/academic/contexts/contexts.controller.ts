import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContextsService } from './contexts.service';
import { CreateContextDto } from './dto/create-context.dto';
import { UpdateContextDto } from './dto/update-context.dto';

@Controller('contexts')
export class ContextsController {
  constructor(private readonly contextsService: ContextsService) {}

  @Post()
  create(@Body() createContextDto: CreateContextDto) {
    return this.contextsService.create(createContextDto);
  }

  @Get()
  findAll() {
    return this.contextsService.findAll();
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
