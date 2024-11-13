import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, InputNumber, Select, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/Header';
import "../styles/CadastroVantagem.css";

const { Option } = Select;
const { Title } = Typography;

const CadastroVantagem = () => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [empresaLogada, setEmpresaLogada] = useState(null); // Estado para armazenar a empresa logada

  useEffect(() => {
    // Obtenha o ID da empresa logada do localStorage e defina o estado
    const idEmpresa = localStorage.getItem('idempresa');
    if (idEmpresa) {
      setEmpresaLogada(idEmpresa); // Define o ID da empresa logada no estado
    } else {
      console.warn("ID da empresa não encontrado no localStorage");
    }
  }, []);

  // Manipula o upload do arquivo e armazena no estado
  const handleUpload = (file) => {
    setFile(file);
    return false;
  };

  // Envia o formulário
  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append('foto', file);
    formData.append('customoedas', values.customoedas);
    formData.append('descricao', values.descricao);
    formData.append('empresaparceira_id', empresaLogada); // Usa o ID da empresa logada

    try {
      const response = await fetch('http://localhost:3000/api/vantagem', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        message.success('Vantagem cadastrada com sucesso!');
        form.resetFields();
        setFile(null);
        navigate('/vantagens');
      } else {
        message.error('Erro ao cadastrar vantagem.');
      }
    } catch (error) {
      console.error('Erro:', error);
      message.error('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div>
      <AppHeader />
      <div className="cadastroVantagem-container">
        <div className="back-button" onClick={() => navigate('/vantagens')}>
          <ArrowLeftOutlined />
        </div>
        <h2 style={{ textAlign: 'center', margin: '20px 0', marginTop: "-1vw", color: "#04448B" }}>Cadastro de Vantagens</h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ width: "60vw", margin: 'auto', padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
        >
          {empresaLogada ? (
            <Form.Item
              name="empresaparceira"
              label="Empresa Parceira"
              initialValue={empresaLogada} // Define o valor inicial como a empresa logada
              rules={[{ required: true, message: 'Por favor, selecione uma empresa.' }]}
            >
              <Select placeholder="Selecione uma empresa" disabled style={{ width: '100%' }}>
                <Option value={empresaLogada}>{empresaLogada}</Option>
              </Select>
            </Form.Item>
          ) : (
            <p>Carregando ID da empresa...</p> // Exibe uma mensagem de carregamento
          )}

          <Form.Item
            name="customoedas"
            label="Custo em Moedas"
            rules={[{ required: true, message: 'Por favor, insira o custo.' }]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              onChange={(value) => {
                form.setFieldsValue({ customoedas: value });
              }}
            />
          </Form.Item>

          <Form.Item
            name="descricao"
            label="Descrição"
            rules={[{ required: true, message: 'Por favor, insira uma descrição.' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="foto"
            label="Upload de Foto"
          >
            <Upload
              customRequest={({ file, onSuccess }) => {
                handleUpload(file);
                onSuccess();
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Clique para enviar</Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit" block style={{ backgroundColor: '#0f4c75', borderColor: '#0f4c75', width: "15vw", textAlign: "center" }}>
              Cadastrar Vantagem
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CadastroVantagem;
