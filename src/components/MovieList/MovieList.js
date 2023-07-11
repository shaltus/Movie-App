import React from 'react'
import { Pagination } from 'antd'
import PropTypes from 'prop-types'

import MovieCard from '../MovieCard/MovieCard'
import './MovieList.css'

class MovieList extends React.Component {
  state = {
    loading: false,
  }

  render() {
    const { movies, onChange } = this.props
    const { loading } = this.state
    return (
      <div>
        <div className="movie-list">
          {movies &&
            movies.length > 0 &&
            movies.map(({ id, overview, title, vote_average, poster_path, release_date, rating, genre_ids }) => (
              <MovieCard
                key={id}
                id={id}
                title={title}
                rating={vote_average}
                loading={loading}
                description={overview}
                genre={genre_ids}
                date={release_date}
                poster={poster_path}
                onChange={onChange}
                stars={rating || this.props.stars[id]}
              />
            ))}
        </div>
        {movies && movies.length > 0 && (
          <Pagination
            className="pagination"
            total={this.props.totalResults}
            current={this.props.currentPage}
            pageSize={20}
            onChange={this.props.onPageChange}
          />
        )}
      </div>
    )
  }
}
MovieList.defaultProps = {
  movies: [],
  totalResults: 0,
  currentPage: 1,
  onChange: () => {},
  onPageChange: () => {},
}
MovieList.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  totalResults: PropTypes.number,
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func,
}

export default MovieList
