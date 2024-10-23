import React from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Row, Col } from 'antd';
import "../styles/Login.css";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const onFinish = (values) => {
    console.log('Valores recebidos do formulário: ', values);
  };

  const handleCadastroClick = () => {
    navigate('/cadastro');
  }


  const navigate = useNavigate(); 

  return (
    <Form
      className="form"
      name="login"
      initialValues={{
        remember: true,
      }}
      style={{
        maxWidth: 400,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: 'Por favor, insira seu email',
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
        <Input prefix={<LockOutlined />} type="password" placeholder="Senha" />
      </Form.Item>

  

      <Form.Item>
        <Button block type="primary" htmlType="submit" style={{ width: '100%' }}>
          Entrar
        </Button>
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          Ainda não possui uma conta? {' '}
          <Button type="link" onClick={handleCadastroClick}>
          Cadastre-se!
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default Login;
