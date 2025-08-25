import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PropTypes from "prop-types";

const SearchReservantions = ({ placeholder = "Buscar", onSearch, ...props }) => {
  const [hover, setHover] = useState(false);
  const [value, setValue] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(value);
    }
    // Limpiar el campo del input
    setValue('');
  };

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div style={styles.container}>
      <Input
        placeholder={placeholder}
        style={styles.input}
        value={value}
        onChange={handleInputChange}
        onKeyPress={(e) => {
          if (!/[0-9]/.test(e.key)) {
            e.preventDefault(); // Previene la entrada de cualquier caracter que no sea un número
          }
        }}
        {...props}
      />
      <Button
        type="primary"
        icon={<SearchOutlined style={{ color: 'white' }} />}
        style={{ ...styles.button, backgroundColor: hover ? '#841F1C' : '#C20E1A', borderColor: hover ? '#841F1C' : '#C20E1A' }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={handleSearch}
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  input: {
    flex: 1,
    maxWidth: '300px',
    marginRight: '10px',
  },
  button: {
    color: 'white',
  },
};

SearchReservantions.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func,
};

export default SearchReservantions;