import "./style.css";

/**
 * Mapa de status/tipo -> variante visual.
 * Adicione aqui novos valores conforme surgirem no back-end
 * (status de unidade, de venda, tipo de imóvel, estado civil, etc).
 */
const STATUS_VARIANTS = {
  Vendido: "gold",
  "Em aberto": "green",
  Reservado: "blue",
  Distratado: "red",
  Financiado: "purple",
  Liquidado: "green",
  Transferido: "blue",
  Lote: "gold",
  Apartamento: "blue",
  Casa: "green",
  Casado: "blue",
  Solteiro: "green",
  Divorciado: "red",
  Viuvo: "purple",
};

/**
 * Tag colorida usada para exibir status ou tipo (ex: "Vendido",
 * "Distratado", "Apartamento"). A cor é escolhida automaticamente
 * a partir do texto do status; se o status não estiver mapeado,
 * usa uma variante neutra.
 *
 * Props:
 * - status: texto exibido no badge e usado para escolher a cor
 */
function StatusBadge({ status }) {
  const variant = STATUS_VARIANTS[status] || "neutral";

  return <span className={`status-badge status-badge--${variant}`}>{status}</span>;
}

export default StatusBadge;