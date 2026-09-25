import "./style.css";

/**
 * Linha de tabela (<tr>) com o efeito de hover já embutido via CSS
 * (evita repetir onMouseEnter/onMouseLeave em cada página).
 * Usada em todas as páginas que possuem tabela.
 *
 * Props:
 * - children: células da linha (TableCell/TableHeaderCell)
 * - highlighted: aplica um destaque fixo na linha (ex: 1º colocado
 *   de um ranking), independente do hover
 */
function TableRow({ children, highlighted = false }) {
  const classes = `table-row ${highlighted ? "table-row--highlighted" : ""}`.trim();

  return <tr className={classes}>{children}</tr>;
}

export default TableRow;