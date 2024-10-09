import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { ProductsList } from "./components/ProductsList/ProductsList";
import { config } from "./config/config";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <Header />
          <ProductsList />
          <Footer />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
