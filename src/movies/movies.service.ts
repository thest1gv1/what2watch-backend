import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class MoviesService {

  constructor(private configService: ConfigService) {
  }

  async recommend(prompt: string) {
    const geminiKey = this.configService.get<string>('GEMINI_KEY')

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          contents: [{parts: [{text: prompt}]}]
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini error details:', errorData)
      throw new Error(`Gemini error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.candidates[0].content.parts[0].text
    const cleaned = text.replace(/```json|```/g, '').trim()
    const movies = JSON.parse(cleaned)

    return await Promise.all(
      movies.map(async (movie: any) => {
        const {
          poster_path,
          tmdb_id,
          backdrop_path
        } = await this.getMoviePoster(movie.originalTitle)
        return {...movie, poster_path, tmdb_id,backdrop_path}
      })
    )


  }

  async getMoviePoster(title: string): Promise<{
    poster_path: string | null,
    tmdb_id: number | null,
    backdrop_path: string | null
  }> {
    const tmdbKey = this.configService.get<string>('TMDB_API_KEY')

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(title)}&language=ru-RU`
    )

    const data = await response.json()
    const movie = data.results?.[0]

    return {
      poster_path: movie?.poster_path ?? null,
      tmdb_id: movie?.id ?? null,
      backdrop_path: movie?.backdrop_path ?? null
    }
  }

  async getTrending() {
    const tmdbKey = this.configService.get<string>('TMDB_API_KEY')

    const response = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbKey}&language=ru-RU`
    )

    const data = await response.json()
    return data.results || []
  }

  async getPopular() {

    const tmdbKey = this.configService.get('TMDB_API_KEY')

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbKey}&language=ru-RU`
    )

    const data = await response.json()
    return data.results || []

  }

  async getById(id: number) {
    const tmdbKey = this.configService.get('TMDB_API_KEY')

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbKey}&language=ru-RU&append_to_response=credits,videos`
    )

    const data = await response.json()
    return data
  }
}