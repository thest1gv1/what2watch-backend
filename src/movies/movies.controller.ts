import {Controller, Post, Body, Get, Res, Query} from '@nestjs/common';
import type { Response } from 'express'
import {MoviesService} from './movies.service';

@Controller('movies')
export class MoviesController {

  constructor(private readonly moviesService: MoviesService) {
  }

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

  @Get('poster')
  async poster(@Query('path') path: string, @Res() res: Response) {
    const imageResponse = await fetch(`https://image.tmdb.org/t/p/w300${path}`)
    const buffer = await imageResponse.arrayBuffer()
    res.set('Content-Type', 'image/webp')
    res.send(Buffer.from(buffer))
  }
}