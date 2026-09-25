import { Navigate, Route, Routes } from "react-router-dom";
import SideBar from "./components/SideBar";
import Clientes from "./routes/Clientes";
import Empreendimentos from "./routes/Empreendimentos";
import Home from "./routes/Home";
import Relatorios from "./routes/Relatorios";
import Unidades from "./routes/Unidades";
import Vendas from "./routes/Vendas";
import Vendedores from "./routes/Vendedores";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <SideBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empreendimentos" element={<Empreendimentos />} />
          <Route path="/unidades" element={<Unidades />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/vendedores" element={<Vendedores />} />
          <Route path="/vendas" element={<Vendas />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
