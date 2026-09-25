import { Search } from "lucide-react";
import "./style.css";

/**
 * Campo de busca com ícone de lupa. Usado na página de Clientes.
 *
 * Este componente é "controlado": o valor digitado e a função que
 * atualiza esse valor (normalmente vindos de um useState na página)
 * são recebidos via props.
 *
 * Props:
 * - value: valor atual do campo
 * - onChange: função chamada a cada alteração do texto digitado
 * - placeholder: texto de apoio exibido quando o campo está vazio
 */
function SearchBox({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div className="search-box">
      <Search size={14} className="search-box__icon" />
      <input
        type="text"
        className="search-box__input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default SearchBox;