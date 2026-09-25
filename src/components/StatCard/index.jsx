import Card from "../Card";
import "./style.css";

/**
 * Card de indicador (KPI): rótulo pequeno + valor em destaque + descrição.
 * Usado no Dashboard, em Empreendimentos e em Vendedores.
 *
 * Reaproveita o componente Card para manter a mesma "moldura" (fundo,
 * borda, radius) usada em toda a aplicação.
 *
 * Props:
 * - label: rótulo curto do indicador (ex: "Total Unidades")
 * - value: valor principal, já formatado (ex: "128" ou "R$ 1.200.000,00")
 * - description: texto de apoio abaixo do valor (opcional)
 * - color: cor de destaque do valor e da borda superior
 *   ("accent" | "gold" | "green" | "red" | "blue" | "purple")
 * - compact: usa uma fonte menor para o valor, útil quando o valor é
 *   um texto longo (ex: valores monetários formatados)
 */
function StatCard({ label, value, description, color = "accent", compact = false }) {
  return (
    <Card accent={color} className="stat-card">
      <div className="stat-card__label">{label}</div>
      <div
        className={`stat-card__value stat-card__value--${color} ${
          compact ? "stat-card__value--compact" : ""
        }`}
      >
        {value}
      </div>
      {description && <div className="stat-card__description">{description}</div>}
    </Card>
  );
}

export default StatCard;