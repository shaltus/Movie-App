export default class MovieService {
  apiKey = 'd42d5cd7bcaef968fc438488729f61e7';
  mainUrl = 'https://api.themoviedb.org/3/';
  tokenId = null;

  async getResource(url) {
    const res = await fetch(url);
    return await res.json();
  }
  catch(error) {
    throw new Error(error);
  }

  async getSearchMovies(searchValue, page) {
    const res = await this.getResource(
      `${this.mainUrl}search/movie?api_key=${this.apiKey}&query=${searchValue}&page=${page}`
    );
    return res;
  }

  async getGuestSession() {
    await this.getResource(`${this.mainUrl}authentication/guest_session/new?api_key=${this.apiKey}`)
      .then((data) => {
        if (localStorage.getItem('guest_session_id')) {
          this.tokenId = localStorage.getItem('guest_session_id');
          return localStorage.getItem('guest_session_id');
        }
        this.tokenId = data.guest_session_id;
        localStorage.setItem('guest_session_id', this.tokenId);
      })
      .catch((e) => e);
  }

  async postRateMovie(id, stars) {
    this.tokenId = localStorage.getItem('guest_session_id');
    const request = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        value: stars,
      }),
    };
    const response = await fetch(
      `${this.mainUrl}movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${this.tokenId}`,
      request
    );
    console.log(response);
    if (!response.ok) {
      throw new Error(`Could not fetch, status: ${response.status}`);
    }
  }

  async getRateMovies(page = 1) {
    const result = await this.getResource(
      `${this.mainUrl}guest_session/${this.tokenId}/rated/movies?page=${page}&api_key=${this.apiKey}`
    );
    return result;
  }
  async getGenresMovies() {
    const genresList = await this.getResource(`${this.mainUrl}genre/movie/list?api_key=${this.apiKey}`);
    return genresList;
  }
}

const movieService = new MovieService();

window.onload = () => {
  localStorage.removeItem('guest_session_id');
  movieService.getGuestSession();
};
