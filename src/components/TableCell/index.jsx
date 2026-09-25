import "./style.css";

/**
 * Célula de dado de tabela (<td>). Usada em todas as páginas
 * que possuem tabela.
 *
 * Props:
 * - children: conteúdo da célula. Quando vazio/nulo, exibe "-"
 * - mono: usa fonte monoespaçada, útil para números, datas e valores
 * - align: alinhamento do texto ("left" | "right"), padrão "left"
 */
function TableCell({ children, mono = false, align = "left" }) {
  const classes = [
    "table-cell",
    mono ? "table-cell--mono" : "",
    align === "right" ? "table-cell--right" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <td className={classes}>{children ?? "-"}</td>;
}

export default TableCell;