import { Controller, Get } from '@nestjs/common';

@Controller('configs')
export class ConfigsController {
  @Get()
  getConfigs() {
    return {
      pexelsApiKey: process.env.PEXELS_API_KEY,
      unsplashApiKey: process.env.UNSPLASH_API_KEY,
    };
  }
}
