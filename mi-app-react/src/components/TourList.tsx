import { useEffect, useState } from 'react';
import BookingButton from './BookingButton'; // Adjust path as needed

interface Tour {
  id: number;
  nombre_tour: string; 
  precio: number;
}

const TourList = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Tip: Replace with process.env.REACT_APP_API_URL in the future
    fetch('http://localhost/tour.php')
      .then((res) => {
        if (!res.ok) throw new Error('Error en la red');
        return res.json();
      })
      .then((datos) => {
        setTours(datos);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar los tours:", err);
        setError(true);
        setCargando(false); 
      });
  }, []);

  if (cargando) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: '#666' }}>Cargando experiencias...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#E63946' }}>Lo sentimos, no pudimos cargar los tours. Por favor, intenta más tarde.</div>;
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '30px',
      padding: '0 20px'
    }}>
      {tours.map((tour) => (
        <div key={tour.id} style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '25px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.2s',
          cursor: 'pointer'
        }}>
          <div>
            <h3 style={{ margin: '0 0 15px', color: '#1D3557', fontSize: '1.5rem' }}>
              {tour.nombre_tour}
            </h3>
            <p style={{ 
              fontSize: '2rem', 
              fontWeight: '900', 
              color: '#220003', 
              margin: '10px 0' 
            }}>
              €{tour.precio}
            </p>
          </div>
          
          {/* Replaced the hardcoded button with the component */}
          <BookingButton onClick={() => console.log(`Reservando ${tour.nombre_tour}`)} />
        </div>
      ))}
    </div>
  );
};

export default TourList;