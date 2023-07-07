import React from 'react';
import { Input } from 'antd';
import './Search.css';
import PropTypes from 'prop-types';

class Search extends React.Component {
  render() {
    return (
      <section className="search">
        <Input className="search__input" placeholder="Type to search..." onChange={this.props.onLabelChange} />
      </section>
    );
  }
}

Search.propTypes = {
  onLabelChange: PropTypes.func.isRequired,
};

export default Search;
