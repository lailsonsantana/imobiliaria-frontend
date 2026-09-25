import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import SideBar from './components/SideBar';

// Pages
import Home           from './pages/Home';
import Empreendimentos from './pages/Empreendimentos';
import Unidades        from './pages/Unidades';
import Clientes        from './pages/Clientes';
import Vendedores      from './pages/Vendedores';
import Vendas          from './pages/Vendas';
import Relatorios      from './pages/Relatorios';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Mobile toggle */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen((o) => !o)}
        aria-label="Abrir menu"
      >
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'sidebar-overlay--visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <SideBar className={sidebarOpen ? 'sidebar--open' : ''} onNavClick={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className="app-main">
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/empreendimentos" element={<Empreendimentos />} />
          <Route path="/unidades"        element={<Unidades />} />
          <Route path="/clientes"        element={<Clientes />} />
          <Route path="/vendedores"      element={<Vendedores />} />
          <Route path="/vendas"          element={<Vendas />} />
          <Route path="/relatorios"      element={<Relatorios />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
