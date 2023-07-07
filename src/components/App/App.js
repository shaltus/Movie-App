import React from 'react';
import { debounce } from 'lodash';
import { Alert } from 'antd';

import Search from '../Search/Search';
import Header from '../Header/Header';
import MovieList from '../MovieList/MovieList';
import MovieService from '../../services/MovieService';
import { GenresProvider } from '../../context';

class App extends React.Component {
  movieService = new MovieService();

  state = {
    searchValue: '',
    movies: [],
    currentPage: 1,
    currentTab: 'search',
    genres: [],
    stars: {},
    moviesRateData: [],
    error: false,
  };

  debounced = debounce(this.updateMovies, 1000);

  componentDidUpdate(prevProps, prevState) {
    if (this.state.searchValue !== prevState.searchValue) {
      console.log('searchValue = ', this.state.searchValue);
      console.log('prevProps.searchValue =', prevState.searchValue);
      this.debounced(this.state.searchValue, this.state.currentPage);
    }
  }
  updateMovies(searchValue, page) {
    this.movieService
      .getSearchMovies(searchValue, page)
      .then((result) => {
        this.setState({
          movies: result.results,
          currentPage: result.page,
          totalResults: result.total_results,
        });
      })
      .catch(() => this.setState({ error: true }));
  }

  onPageChange = (page) => {
    if (this.state.currentTab === 'rated') {
      this.setState({ currentPage: page }, () => {
        this.ratedFilms(page);
      });
    } else {
      this.setState({ currentPage: page }, () => {
        this.updateMovies(this.state.searchValue, page);
      });
    }
  };

  onLabelChange = (e) => {
    this.setState({
      searchValue: e.target.value,
    });
  };

  setTab = (event) => {
    this.setState({
      currentTab: event,
    });
    if (event === 'rated') {
      this.ratedFilms();
    }
  };

  onChange = async (star, id) => {
    this.setState((prevState) => ({
      stars: {
        ...prevState.stars,
        [id]: star,
      },
    }));
    try {
      await this.movieService.postRateMovie(id, star);
    } catch (e) {
      this.setState({ error: true });
    }
  };

  ratedFilms = (page = 1) => {
    this.movieService
      .getRateMovies(page)
      .then((rateData) => {
        this.setState(() => {
          return {
            moviesRateData: rateData.results,
            pageRateAll: rateData.total_pages,
            pageRate: rateData.total_results,
          };
        });
      })
      .catch(() => this.setState({ error: true }));
  };

  componentDidMount() {
    this.getGenres();
  }

  componentDidCatch() {
    this.setState({ error: true });
  }

  getGenres = () => {
    this.movieService
      .getGenresMovies()
      .then((data) => {
        this.setState(() => {
          return { genres: data.genres };
        });
      })
      .catch(() => this.setState({ error: true }));
  };

  render() {
    return (
      <main className="main">
        {!this.state.error ? (
          <GenresProvider value={this.state.genres}>
            <Header setTab={this.setTab} currentTab={this.state.currentTab} />
            {this.state.currentTab === 'search' ? (
              <>
                <Search onLabelChange={this.onLabelChange} />
                <MovieList
                  movies={this.state.movies}
                  onPageChange={this.onPageChange}
                  totalResults={this.state.totalResults}
                  currentPage={this.state.currentPage}
                  onChange={this.onChange}
                  stars={this.state.stars}
                />
              </>
            ) : (
              <MovieList
                movies={this.state.moviesRateData}
                onPageChange={this.onPageChange}
                totalResults={this.state.pageRate}
                currentPage={this.state.currentPage}
                onChange={this.onChange}
                stars={this.state.stars}
              />
            )}
          </GenresProvider>
        ) : (
          <Alert
            message="Sorry, we can't connect to the server at the moment. Please check your internet connection and try again."
            type="error"
          />
        )}
      </main>
    );
  }
}
export default App;
