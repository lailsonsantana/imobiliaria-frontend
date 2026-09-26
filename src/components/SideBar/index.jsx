import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Users,
  Award,
  FileText,
  TrendingUp,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import "./style.css";

/**
 * Itens de navegação fixos da aplicação.
 */
const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/empreendimentos", label: "Empreendimentos", icon: Building2 },
  { path: "/unidades", label: "Unidades", icon: MapPin },
  { path: "/clientes", label: "Clientes", icon: Users },
  { path: "/vendedores", label: "Vendedores", icon: Award },
  { path: "/vendas", label: "Vendas", icon: FileText },
  { path: "/relatorios", label: "Relatórios", icon: TrendingUp },
];

/**
 * Menu lateral fixo com seletor de paleta (SelectBox) e alternador de modo Claro/Escuro (SlideBox).
 *
 * Props:
 * - className: classes adicionais (ex: "sidebar--open" em mobile)
 * - onNavClick: callback chamado ao clicar num link (fechar sidebar no mobile)
 */
function Sidebar({ className = '', onNavClick }) {
  const { colorScheme, setColorScheme, colorSchemes, mode, toggleMode } = useTheme();

  return (
    <aside className={`sidebar ${className}`.trim()}>
      <div className="sidebar__brand">
        <div className="sidebar__brand-name">Prosperiam</div>
        <div className="sidebar__brand-sub">Empreendimentos</div>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
            onClick={onNavClick}
          >
            <Icon size={15} className="sidebar__link-icon" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Seção de Tema (SelectBox) e Modo Claro/Escuro (SlideBox) */}
      <div className="sidebar__theme-section">
        <div className="sidebar__theme-header">
          <span className="sidebar__theme-title">Tema & Modo</span>
        </div>

        {/* 1. SelectBox para Paletas: Gold, Purple, Blues */}
        <div className="sidebar__theme-field">
          <label htmlFor="theme-select" className="sidebar__field-label">
            Paleta de Cores
          </label>
          <div className="sidebar__select-wrapper">
            <select
              id="theme-select"
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value)}
              className="sidebar__select"
              aria-label="Selecionar paleta de cores (Gold, Purple, Blues)"
            >
              {colorSchemes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.label})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. SlideBox para Alternar entre Dia (Light/White) e Noite (Dark) */}
        <div className="sidebar__theme-field">
          <div className="sidebar__mode-row">
            <span className="sidebar__field-label">
              {mode === "light" ? "Modo Claro" : "Modo Escuro"}
            </span>
            <button
              type="button"
              className={`sidebar__slidebox ${
                mode === "dark" ? "sidebar__slidebox--dark" : "sidebar__slidebox--light"
              }`}
              onClick={toggleMode}
              aria-label={`Alternar para ${
                mode === "light" ? "modo escuro (noite)" : "modo claro (dia)"
              }`}
              title={`Alternar para modo ${mode === "light" ? "Escuro" : "Claro"}`}
            >
              <div className="sidebar__slidebox-track">
                <span className="sidebar__slidebox-icon sidebar__slidebox-icon--sun">
                  <Sun size={12} />
                </span>
                <span className="sidebar__slidebox-icon sidebar__slidebox-icon--moon">
                  <Moon size={12} />
                </span>
                <div className="sidebar__slidebox-thumb">
                  {mode === "light" ? <Sun size={11} /> : <Moon size={11} />}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="sidebar__footer">
        <span>© 2026 Prosperiam</span>
      </div>
    </aside>
  );
}

export default Sidebar;