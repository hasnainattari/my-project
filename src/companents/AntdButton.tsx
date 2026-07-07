import { Button } from 'antd';

export const AntdButton = ({ text, onClick, color }: any) => (
    <Button type="primary" onClick={onClick}
        style={{ width: "100%" }}
        color={color}
        variant="solid"
    >{text}</Button>
);