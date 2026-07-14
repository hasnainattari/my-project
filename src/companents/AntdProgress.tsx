import "./index.scss"
import { Progress } from 'antd';

const AntdProgress = ({ percent, displayPercent, text, onClick, voted, count, disabled }: any) => {
    // Defensive clamp — the bar width can never legitimately go under 0%
    // or over 100%, no matter what the caller passes in.
    const safePercent = Math.min(100, Math.max(0, percent || 0))
    const shownPercent = displayPercent ?? Math.round(safePercent)

    return (
        <div
            className={`antd-progress${voted ? " voted" : ""}${disabled && !voted ? " disabled" : ""}`}
            onClick={disabled ? undefined : onClick}
            role="button"
            aria-disabled={disabled}
        >
            <span className="stamp-dot" />
            <div className="progress-body">
                <p>
                    <span className="option-text">{text}</span>
                    <span className="pct">{count} vote{count === 1 ? "" : "s"} · {shownPercent}%</span>
                </p>
                <Progress
                    percent={safePercent}
                    showInfo={false}
                    strokeColor={voted ? "#b23a2e" : "#1c2438"}
                />
            </div>
            {voted ? <span className="voted-badge">Your vote</span> : null}
        </div>
    )
};

export default AntdProgress;
