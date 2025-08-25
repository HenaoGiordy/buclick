import { useState } from 'react';
import { Button, Input, DatePicker, ConfigProvider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PropTypes from "prop-types";
import dayjs from 'dayjs';
import esES from 'antd/es/locale/es_ES';

const { RangePicker } = DatePicker;

export default function SearchPicker({ placeholder = "Buscar", queryValue, dateRangeValue, onSearch, onQueryChange, onDateRangeChange, ...props }) {
    const [hover, setHover] = useState(false);
    
    const handleSearch = () => {
        if (onSearch) {
            onSearch({ query: queryValue, dateRange: dateRangeValue });
        }
    };

    const handleInputChange = (e) => {
        if (onQueryChange) {
            onQueryChange(e.target.value);
        }
    };

    const handleDateChange = (dates) => {
        if (onDateRangeChange) {
            onDateRangeChange(dates ? [dayjs(dates[0]), dayjs(dates[1])] : null);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === '.' || e.key === ',' || e.key === '-') {
            e.preventDefault();
        }
    };
    

    return (
        <ConfigProvider locale={esES}>
            <div style={styles.container}>
                <Input
                    placeholder={placeholder}
                    style={styles.input}
                    type='number'
                    value={queryValue}
                    onChange={handleInputChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    onKeyDown={handleKeyDown}
                    {...props}
                />
                <RangePicker
                    placeholder={['Fecha inicial', 'Fecha final']}
                    style={styles.datePicker}
                    onChange={handleDateChange}
                    value={dateRangeValue && dateRangeValue.length === 2 ? dateRangeValue : null}
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
        </ConfigProvider>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '10px'
    },
    input: {
        flex: 1,
        maxWidth: '200px',
    },
    datePicker: {
        flex: 1,
        maxWidth: '300px'
    },
    button: {
        color: 'white',
    },
};

SearchPicker.propTypes = {
    placeholder: PropTypes.string,
    queryValue: PropTypes.string,
    dateRangeValue: PropTypes.array,
    onSearch: PropTypes.func,
    onQueryChange: PropTypes.func,
    onDateRangeChange: PropTypes.func,
    onHoverChange: PropTypes.func,
};
