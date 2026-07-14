import "./index.scss"
import { Progress } from 'antd';

const AntdProgress = ({ percent, text, onClick, voted, count }: any) => {
    return (
        <div className={`antd-progress${voted ? " voted" : ""}`}
            onClick={onClick}
        >
            <span className="stamp-dot"></span>
            <div className="progress-body">
                <p>
                    <span>{text}</span>
                    <span className="pct">{count} vote{count === 1 ? "" : "s"} · {percent}%</span>
                </p>
                <Progress
                    percent={percent}
                    showInfo={false}
                    size={["100%", 10]}
                />
            </div>
        </div>
    )
};

export default AntdProgress;
