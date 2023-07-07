import React from 'react';
import './Header.css';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';

class Header extends React.Component {
  array = [
    { label: 'Search', key: 'search' },
    { label: 'Rated', key: 'rated' },
  ];

  render() {
    const { currentTab, setTab } = this.props;

    return (
      <header className="navigation">
        <Tabs
          onChange={setTab}
          activeKey={currentTab}
          items={this.array.map((item) => ({
            label: item.label,
            key: item.key,
          }))}
        />
      </header>
    );
  }
}
Header.defaultProps = {
  setTab: () => {},
  currentTab: 'search',
};
Header.propTypes = {
  setTab: PropTypes.func,
  currentTab: PropTypes.string,
};
export default Header;
