import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Query,
} from '@nestjs/common';
import { FruitsService } from 'src/fruits/services/fruits.service';
import { Fruit } from '../models/fruit.model';

function isNumber(value: string | number): value is number {
  return typeof value === 'number' && !isNaN(value);
}

@Controller('fruits')
export class FruitsController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly fruitsService: FruitsService) { }

  @Get()
  @HttpCode(200)
  find(@Query() query: Record<string, string>) {
    if (Object.keys(query).length === 0) {
      return this.fruitsService.findAll();
    }

    return this.fruitsService.find(query);
  }

  @Get('all')
  @HttpCode(200)
  findAll() {
    return this.fruitsService.findAll();
  }

  @Get('family/:value')
  @HttpCode(200)
  findByFamily(@Param('value') value: Fruit['family']) {
    return this.find({ family: value });
  }

  @Get('genus/:value')
  @HttpCode(200)
  findByGenus(@Param('value') value: Fruit['genus']) {
    return this.find({ genus: value });
  }

  @Get('order/:value')
  @HttpCode(200)
  findByOrder(@Param('value') value: Fruit['order']) {
    return this.find({ order: value });
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') idOrValue: number) {
    const asNumber = Number(idOrValue);
    const response: Fruit | null = isNumber(asNumber)
      ? this.fruitsService.findOne(Number(idOrValue))
      : (this.find({ name: String(idOrValue) })[0] ?? null);

    if (!response) {
      throw new HttpException('Fruit not found', 404);
    }

    return response;
  }
}
