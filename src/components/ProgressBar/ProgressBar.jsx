import './style.css';

/**
 * Barra de progresso horizontal.
 * Props:
 * - percentage: 0–100
 * - color: "accent" | "gold" | "green" | "blue" (padrão: "accent")
 */
function ProgressBar({ percentage = 0, color = 'accent' }) {
  return (
    <div className="progress-bar">
      <div
        className={`progress-bar__fill progress-bar__fill--${color}`}
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      />
    </div>
  );
}

export default ProgressBar;
