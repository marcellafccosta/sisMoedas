import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, InputNumber, Select, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Importa o useNavigate
import AppHeader from '../components/Header'; // Importando o AppHeader
import "../styles/CadastroVantagem.css"; 

const { Option } = Select;
const { Title } = Typography;

const CadastroVantagem = () => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const navigate = useNavigate(); // Inicializa o navigate

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/empresaparceira');
        const data = await response.json();
        setEmpresas(data);
      } catch (error) {
        console.error('Erro ao carregar empresas:', error);
      }
    };

    fetchEmpresas();
  }, []);

  // Manipula o upload do arquivo e armazena no estado
  const handleUpload = (file) => {
    setFile(file); // Armazena o arquivo selecionado no estado
    return false; // Impede o upload automático
  };

  // Envia o formulário
  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append('foto', file); // 'foto' deve ter o arquivo correto
    formData.append('customoedas', values.customoedas);
    formData.append('descricao', values.descricao);
    formData.append('empresaparceira_id', values.empresaparceira);

    console.log('Dados enviados:', {
      foto: file,
      customoedas: values.customoedas,
      descricao: values.descricao,
      empresaparceira_id: values.empresaparceira,
    });

    try {
      const response = await fetch('http://localhost:3000/api/vantagem', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        message.success('Vantagem cadastrada com sucesso!');
        form.resetFields(); // Limpa o formulário
        setFile(null); // Reseta o estado do arquivo
        navigate('/vantagens'); // Redireciona para a página de vantagens
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
        <h2 style={{ textAlign: 'center', margin: '20px 0', marginTop: "-1vw", fontSize: "30px" }}>Cadastro de Vantagens</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ width: "60vw", margin: 'auto', padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
        >
          <Form.Item
            name="empresaparceira"
            label="Empresa Parceira"
            rules={[{ required: true, message: 'Por favor, selecione uma empresa.' }]}
          >
            <Select placeholder="Selecione uma empresa" style={{ width: '100%' }}>
              {empresas.map((empresa) => (
                <Option key={empresa.idempresa} value={empresa.idempresa}>
                  {empresa.nome}
                </Option>
              ))}
            </Select>
          </Form.Item>

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
                onSuccess(); // Chame onSuccess assim que o arquivo for tratado
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
