import { Button } from 'antd';

export const AntdButton = ({ text, onClick, color, htmlType }: any) => (
    <Button onClick={onClick}
        htmlType={htmlType || "button"}
        style={{ width: "100%" }}
        color={color || "primary"}
        variant="solid"
    >{text}</Button>
);