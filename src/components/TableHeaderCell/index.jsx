import "./style.css";

/**
 * Célula de cabeçalho de tabela (<th>). Usada em todas as páginas
 * que possuem tabela.
 *
 * Props:
 * - children: texto do cabeçalho da coluna
 * - align: alinhamento do texto ("left" | "right"), padrão "left"
 */
function TableHeaderCell({ children, align = "left" }) {
  const classes = `table-header-cell ${
    align === "right" ? "table-header-cell--right" : ""
  }`.trim();

  return <th className={classes}>{children}</th>;
}

export default TableHeaderCell;