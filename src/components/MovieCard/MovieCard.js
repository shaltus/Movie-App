import React from 'react';
import { Card, Tag, Rate, Spin } from 'antd';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

import './MovieCard.css';
import { GenresConsumer } from '../../context';

class MovieCard extends React.Component {
  state = {
    loading: true,
    genres: [],
  };
  handleImgLoad = () => {
    this.setState({ loading: false });
  };

  render() {
    const { title, rating, description, genre, date, poster, onChange, stars } = this.props;
    const { loading } = this.state;

    const imgNull = 'https://orac-ural.ru/wp-content/uploads/2018/01/placeholder_1000x1280.jpg';
    const image = `https://image.tmdb.org/t/p/w500/${poster}`;
    const imagePoster = poster ? image : imgNull;

    let color;
    if (rating > 7) {
      color = '#66E900';
    } else if (rating >= 5) {
      color = '#E9D100';
    } else if (rating > 3) {
      color = '#E97E00';
    } else {
      color = '#E90000';
    }

    return (
      <GenresConsumer>
        {(genres) => {
          const genreNames = genre.map((id) => {
            const genreObj = genres.find((gen) => gen.id === id);
            return genreObj ? genreObj.name : '';
          });
          return (
            <Card className="card">
              <div className="card__image">
                {loading && <Spin className="spin" size="large" />}
                <img
                  src={imagePoster}
                  alt="Movie Poster"
                  onLoad={this.handleImgLoad}
                  style={loading ? { display: 'none' } : {}}
                />
              </div>
              <div className="card__details">
                <div className="card__header">
                  <div className="card__title">
                    <h3>{title}</h3>
                  </div>
                  <div className="card__rating" style={{ border: `2px solid ${color}` }}>
                    <span className="card__rating-value">{rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="card__release-date">{date ? format(new Date(date), 'MMMM d, yyyy') : ''}</p>
                <div className="card__tags">
                  {genreNames.map((genreName, index) => (
                    <Tag className="card__genre" key={index}>
                      {genreName}
                    </Tag>
                  ))}
                </div>
                <div>
                  <p className="card__info">{description}</p>
                  <Rate
                    className="card__stars"
                    count={10}
                    allowHalf
                    defaultValue={0}
                    onChange={(value) => onChange(value, this.props.id)}
                    value={stars}
                  ></Rate>
                </div>
              </div>
              <div></div>
            </Card>
          );
        }}
      </GenresConsumer>
    );
  }
}
MovieCard.defaultProps = {
  stars: 0,
};

MovieCard.propTypes = {
  title: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  genre: PropTypes.arrayOf(PropTypes.number).isRequired,
  date: PropTypes.string,
  poster: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  stars: PropTypes.number,
};
export default MovieCard;
