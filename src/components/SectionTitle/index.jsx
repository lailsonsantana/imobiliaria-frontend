import "./style.css";



/**
 * Rótulo de seção usado dentro dos cards para identificar cada
 * bloco de conteúdo (ex: "Ranking Vendedores", "Consulta 1 — ...").
 *
 * Props:
 * - children: texto do rótulo
 */
function SectionTitle({ children }) {
  return <div className="section-title">{children}</div>;
}

export default SectionTitle;