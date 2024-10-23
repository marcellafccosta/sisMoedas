import React from "react";
import { Button, Form, Input } from 'antd';
import "../styles/Cadastro.css";
import { useNavigate } from 'react-router-dom';

const Cadastro = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSubmit = async (values) => {
        try {
            const response = await fetch('http://localhost:3000/api/usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Falha ao cadastrar usuário');
            } else {
                alert('Usuário cadastrado com sucesso!');
                form.resetFields();
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const onFinish = (values) => {
        handleSubmit(values);
    };

    return (
        <div className="cadastro-container">
            <Form
                form={form}
                name="register"
                onFinish={onFinish}
                className="cadastro-form"
                scrollToFirstError
            >
                <div className="cadastro-title">Cadastro</div>

                <Form.Item
                    name="nome"
                    label="Nome completo"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, insira seu nome completo!',
                        },
                    ]}
                >
                    <Input placeholder="Nome Completo" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: 'email',
                            message: 'E-mail inválido!',
                        },
                        {
                            required: true,
                            message: 'Por favor, insira seu e-mail!',
                        },
                    ]}
                >
                    <Input placeholder="E-mail" />
                </Form.Item>

                <Form.Item
                    name="senha"
                    label="Senha"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, insira sua senha!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password placeholder="Senha" />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirme sua senha"
                    dependencies={['senha']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, confirme sua senha!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('senha') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('As senhas não coincidem!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Confirme sua senha" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Cadastrar
                    </Button>
                    <div className='possuiConta'>
                        Já possui uma conta?{' '}
                        <Button type="link" onClick={handleLoginClick}>
                            Login
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Cadastro;
