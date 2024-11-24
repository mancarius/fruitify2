import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FruitsModule } from './fruits/fruits.module';
import { ConfigsModule } from './configs/configs.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [FruitsModule, ConfigsModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
