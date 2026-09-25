import "./style.css";

function ProgressBar({ percentage = 0, color }) {
  const safePercentage = Math.min(Math.max(Number(percentage) || 0, 0), 100);
  const style = {
    width: `${safePercentage}%`,
    ...(color ? { backgroundColor: color } : {}),
  };

  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuenow={Math.round(safePercentage)}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div className="progress-track__bar" style={style} />
    </div>
  );
}

export default ProgressBar;
