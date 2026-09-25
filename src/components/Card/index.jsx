import "./style.css";

/**
 * Container padrão usado em todas as páginas para agrupar conteúdo
 * (tabelas, KPIs, gráficos, listas, etc).
 *
 * Props:
 * - children: conteúdo do card
 * - noPadding: remove o padding interno (usado quando o card contém
 *   uma tabela que já tem seu próprio espaçamento)
 * - accent: cor opcional da borda superior ("gold" | "green" | "red" |
 *   "blue" | "purple" | "accent"). Quando omitido, nenhuma borda extra é exibida.
 * - className: classes adicionais, caso a página precise de um ajuste pontual
 */
function Card({ children, noPadding = false, accent, className = "" }) {
  const classes = [
    "card",
    noPadding ? "card--no-padding" : "",
    accent ? `card--accent-${accent}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}

export default Card;