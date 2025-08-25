// DateSpanish.jsx
import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const datePickerStyle = {
  width: '100%',
};

const DateSpanish = ({ value, onChange, disabled, placeholder }) => {
  const dateValue = value ? dayjs(value) : null;

  const handleChange = (date) => {
    const dateString = date ? date.format('YYYY-MM-DD') : '';
    onChange(dateString);
  };

  return (
    <DatePicker
      value={dateValue}
      onChange={handleChange}
      disabled={disabled}
      placeholder={placeholder || "Seleccione fecha"}
      format="DD/MM/YYYY"
      style={datePickerStyle}
      disabledDate={(current) => current && current.isBefore(dayjs(), 'day')} // Deshabilita fechas pasadas
    />
  );
};

export default DateSpanish;
