import './i18n'; 
import Header from './components/Header';
import TourList from './components/TourList';
// 1. Asegúrate de que esta ruta sea la correcta en tu carpeta
import background from "./assets/TABAJO.jpg";

function App() {
  return (
    <div style={{ 
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
      // 2. CORRECCIÓN: Usamos la variable 'background' con template literals ``
      backgroundImage: `url(${background})`, 
      backgroundSize: 'cover', // Opcional: para que cubra toda la pantalla
      backgroundPosition: 'center', // Opcional: para que esté centrada
      minHeight: '100vh',
      paddingBottom: '60px'
    }}>
      
      <Header />
      
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <TourList />
      </main>

    </div>
  );
}

export default App;