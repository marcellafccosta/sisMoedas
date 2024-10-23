import React from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Row, Col } from 'antd';
import "../styles/Login.css";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const onFinish = (values) => {
    console.log('Valores recebidos do formulário: ', values);
  };


  const navigate = useNavigate(); 

  return (
    <Form
      className="form"
      name="login"
      initialValues={{
        remember: true,
      }}
      style={{
        maxWidth: 360,
        margin: '0 auto',
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Por favor, insira seu nome de usuário!',
          },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="E-mail" />
      </Form.Item>

      <Form.Item
        name="password"
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
        <Button block type="primary" htmlType="submit">
          Entrar
        </Button>
        ou <a href="/cadastro">Cadastre-se agora!</a>
      </Form.Item>
    </Form>
  );
};

export default Login;
