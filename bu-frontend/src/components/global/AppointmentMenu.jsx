import React from 'react';
import { Card } from 'antd';

const { Meta } = Card;

const AppointmentMenu = ({ image, title, style }) => (
  <Card
    hoverable
    style={{ width: 984, 
    ...style, 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    }} // Aplica el estilo recibido
    cover={<img alt={title} src={image} style={{ padding: '10px' }} />}
  >
    <Meta title={title} />
  </Card>
);

export default AppointmentMenu;