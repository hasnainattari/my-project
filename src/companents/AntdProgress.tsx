import "./index.scss"
import { Progress } from 'antd';

const AntdProgress = ({ percent, text, onClick }: any) => {
    return (
        <div className='antd-progress'
            onClick={onClick}
        >
            <p>{text}</p>
            <Progress
                percent={percent}
                percentPosition={{ align: 'center', type: 'inner' }}
                size={[400, 20]}
            />
        </div>
    )
};

export default AntdProgress;