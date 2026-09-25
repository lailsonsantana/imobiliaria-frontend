import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Users,
  Award,
  FileText,
  TrendingUp,
} from "lucide-react";
import "./style.css";

/**
 * Itens de navegação fixos da aplicação (6 páginas).
 * O item "Esquema NoSQL" foi removido conforme solicitado.
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
 * Menu lateral fixo, presente em todas as páginas.
 * A navegação usa o React Router (NavLink), que já cuida de marcar
 * o item ativo sozinho — por isso o Sidebar não recebe props.
 *
 * Props:
 * - className: classes adicionais (ex: "sidebar--open" em mobile)
 * - onNavClick: callback chamado ao clicar num link (fechar sidebar no mobile)
 */
function Sidebar({ className = '', onNavClick }) {
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

      <div className="sidebar__footer">© 2026 Prosperiam</div>
    </aside>
  );
}

export default Sidebar;