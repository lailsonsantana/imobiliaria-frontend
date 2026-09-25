import "./style.css";

/**
 * Botão de filtro em formato "pill", com estado visual ativo/inativo.
 * Usado na página de Unidades (filtros de status e tipo).
 *
 * O controle de qual filtro está ativo fica na página que usa este
 * componente (ex: via useState); o FilterButton só recebe o estado
 * pronto e avisa quando for clicado.
 *
 * Props:
 * - label: texto exibido no botão
 * - active: define se o botão está no estado selecionado
 * - onClick: função chamada ao clicar no botão
 */
function FilterButton({ label, active = false, onClick }) {
  return (
    <button
      type="button"
      className={`filter-button ${active ? "filter-button--active" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default FilterButton;