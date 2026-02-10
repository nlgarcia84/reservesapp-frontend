import React from 'react';
import { useState } from 'react';
import { Card } from './components/Card';
import { Header } from './components/Header';
import './global.css';

function App() {
  const [sales, setSales] = useState([]);

  const fetchSales = async () => {
    try {
      const res = await fetch('http://localhost:8080/rooms');
      console.log('Status:', res.status);
      if (!res.ok) {
        throw new Error('Error al obtenir les sales');
      }
      const data = await res.json();
      console.log('Data rebuda:', data);
      setSales(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header />
      <Card title={'Sales disponibles'} data={sales} onClick={fetchSales} />
    </>
  );
}

export default App;
