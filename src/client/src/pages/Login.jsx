import React from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd'; 
import "../styles/Login.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const Login = () => {
  const navigate = useNavigate(); 
  const onFinish = async (values) => {
    try {
        console.log('Valores recebidos do formulário: ', values);
        
        // Fazendo a requisição de login para o backend
        const response = await axios.post('http://localhost:3000/api/usuario/login', {
            email: values.email,
            senha: values.senha
        });

        console.log('Resposta da API:', response.data);

        const { token, usuario } = response.data; 

        // Verifica se o usuário e a empresa estão presentes na resposta
        if (usuario && usuario.empresa && usuario.empresa.length > 0) {
          const idEmpresa = usuario.empresa[0].idempresa;
          localStorage.setItem('idempresa', idEmpresa); // Salva o ID da empresa no localStorage
          navigate('/cadastrovantagem'); // Redireciona após login
        } else {
          console.error("ID da empresa não retornado");
        }

        // Verifica se o ID do usuário está na resposta
        if (usuario && usuario.idusuario) {
            localStorage.setItem('idusuario', usuario.idusuario); // Salva o ID do usuário no localStorage
            message.success(`Bem-vindo, ${usuario.nome}!`);
            navigate(`/perfil/${usuario.idusuario}`);
        } else {
            message.error("ID do usuário não encontrado na resposta.");
            return;
        }

        localStorage.setItem('token', token); 

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        message.error('Erro ao fazer login. Verifique suas credenciais.');
    }
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
