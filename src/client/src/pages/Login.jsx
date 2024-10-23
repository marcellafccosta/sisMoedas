import React from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import "../styles/Login.css";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate(); 

  const onFinish = (values) => {
    console.log('Valores recebidos do formulário: ', values);
    // Aqui você pode adicionar lógica para autenticar o usuário.
  };

  const handleCadastroClick = () => {
    navigate('/cadastro');
  }

  return (
    <div className="login-container">
      <Form
        className="login-form"
        name="login"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <div className="login-title">Login</div>

        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Por favor, insira seu email!',
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="E-mail" />
        </Form.Item>

        <Form.Item
          name="senha"
          rules={[
            {
              required: true,
              message: 'Por favor, insira sua senha!',
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Senha" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Entrar
          </Button>
          <div className="possuiConta">
            Ainda não possui uma conta?{' '}
            <Button type="link" onClick={handleCadastroClick}>
              Cadastre-se!
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
