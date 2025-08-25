import { useState } from 'react';
import { Button, Input } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import PropTypes from "prop-types";

const SearchInput = ({ 
  placeholder = "Buscar", 
  onClick = () => {}, 
  onChange = () => {}, 
  onRefresh = () => {},  // Nueva prop para manejar el refresco
  ...props 
}) => {
  const [hover, setHover] = useState(false);
  const [inputValue, setInputValue] = useState(""); // Estado local para controlar el valor del input

  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Actualiza el estado local
    onChange(e); // Llama a la función onChange proporcionada
  };

  const handleRefresh = () => {
    setInputValue(""); // Limpia el input
    onRefresh(); // Llama a la función onRefresh proporcionada
  };

  return (
    <div style={styles.container}>
      <Input
        value={inputValue} // El valor está controlado por el estado local
        placeholder={placeholder}
        style={styles.input}
        onChange={handleInputChange}
        {...props}
      />
      <Button
        type="primary"
        icon={<SearchOutlined style={{ color: 'white' }} />}
        style={{
          ...styles.button,
          backgroundColor: hover ? '#841F1C' : '#C20E1A',
          borderColor: hover ? '#841F1C' : '#C20E1A'
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClick}
      />
      <Button
        type="default"
        icon={<ReloadOutlined />}
        style={{
          ...styles.button,
          backgroundColor: hover ? '#841F1C' : '#C20E1A',
          borderColor: hover ? '#841F1C' : '#C20E1A',
          marginLeft: '10px',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={handleRefresh} // Llama a handleRefresh en lugar de onRefresh directamente
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

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  onRefresh: PropTypes.func, // Nueva prop para manejar la función de refresco
};

export default SearchInput;
