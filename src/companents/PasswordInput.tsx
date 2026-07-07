import { Input } from 'antd';

export const PasswordInput = ({ placeholder, onChange }: any) => {
    return (
        <Input.Password placeholder={placeholder} onChange={onChange} />
    );
};