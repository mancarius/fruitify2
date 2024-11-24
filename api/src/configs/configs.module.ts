import { Module } from '@nestjs/common';
import { ConfigsController } from './configs.controller';

@Module({
  imports: [],
  controllers: [ConfigsController],
  providers: [],
})
// eslint-disable-next-line prettier/prettier
export class ConfigsModule { }
