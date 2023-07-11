import React from 'react'
import { Input } from 'antd'
import './Search.css'
import PropTypes from 'prop-types'

function Search({ onLabelChange }) {
  return (
    <section className="search">
      <Input className="search__input" placeholder="Type to search..." onChange={onLabelChange} />
    </section>
  )
}

Search.propTypes = {
  onLabelChange: PropTypes.func.isRequired,
}

export default Search
