// DateSpanish.jsx
import { DatePicker } from 'antd';
import 'dayjs/locale/es';

const DateSpanish = (props) => {

  return (
    <DatePicker
      style={{width:`20ch`, ...props.style}}
      {...props}
    />
  );
};

export default DateSpanish;
