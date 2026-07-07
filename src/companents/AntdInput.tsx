import { Input } from 'antd';

export const AntdInput = ({ placeholder, type, onChange, className, value }: any) => {
    return (
        <Input placeholder={placeholder} type={type}
            onChange={onChange} className={className}
            value={value}
        />
    )
};