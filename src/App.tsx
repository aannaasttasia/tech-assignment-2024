import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { ProductsList } from './components/ProductsList/ProductsList';

function App() {
  return (
    <div className="App">
      <Header/>
      <ProductsList/>
      <Footer/>
    </div>
  );
}

export default App;
