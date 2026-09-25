import ProgressBar from "../ProgressBar/ProgressBar";
import "./style.css";

/**
 * Linha de ranking: "#posição + nome + barra de progresso + valor".
 * Usada no Dashboard (ranking de vendedores).
 *
 * Props:
 * - position: posição no ranking (número, ex: 1, 2, 3...)
 * - name: nome exibido na linha
 * - value: valor em destaque à direita (ex: quantidade de vendas)
 * - percentage: percentual usado para preencher a barra de progresso
 *   (normalmente calculado em relação ao maior valor da lista)
 */
function RankingRow({ position, name, value, percentage }) {
  return (
    <div className="ranking-row">
      <span className="ranking-row__position">#{position}</span>
      <div className="ranking-row__info">
        <div className="ranking-row__name">{name}</div>
        <ProgressBar percentage={percentage} />
      </div>
      <span className="ranking-row__value">{value}</span>
    </div>
  );
}

export default RankingRow;