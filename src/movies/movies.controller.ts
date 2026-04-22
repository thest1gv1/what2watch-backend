import {Controller, Post, Body, Get,  Param} from '@nestjs/common';

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

  // @Get('poster')
  // async poster(@Query('path') path: string, @Query('size') size: string = 'w300', @Res() res: Response) {
  //   const imageResponse = await fetch(`https://image.tmdb.org/t/p/${size}${path}`)
  //   const buffer = await imageResponse.arrayBuffer()
  //   res.set('Content-Type', 'image/webp')
  //   res.send(Buffer.from(buffer))
  // }

  @Get('poster')
  async getMoviePoster() {
    return this.moviesService.getPopular()
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.moviesService.getById(Number(id))
  }

}