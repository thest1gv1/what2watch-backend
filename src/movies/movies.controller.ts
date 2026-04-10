import {Controller, Post, Body, Get} from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {

  constructor(private readonly moviesService: MoviesService) {}

  @Post('recommend')
  async recommend(@Body() body: { prompt: string }) {
    return this.moviesService.recommend(body.prompt)
  }

  @Get('trending')
  async trending() {
    return this.moviesService.getTrending()
  }

  @Get('popular')
  async popular() {
    return this.moviesService.getPopular()
  }
}