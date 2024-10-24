import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, message } from 'antd';
import "../styles/Cadastro.css";
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const Cadastro = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [userType, setUserType] = useState(null);
    const [instituicoes, setInstituicoes] = useState([]);

    useEffect(() => {
        const fetchInstituicoes = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/instituicao`);
                if (response.ok) {
                    const data = await response.json();
                    setInstituicoes(data);
                } else {
                    console.error('Erro ao buscar instituições');
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
            }
        };

        fetchInstituicoes();
    }, []);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleUserTypeChange = (value) => {
        setUserType(value);
    };

    const handleSubmit = async (values) => {
        try {
            const payload = {
                usuario: {
                    nome: values.nome,
                    email: values.email,
                    senha: values.senha,
                },
                tipo: values.tipo,
            };

            if (values.tipo === "aluno") {
                payload.cpf = values.cpf;
                payload.rg = values.rg;
                payload.curso = values.curso;
                payload.endereco = {
                    logradouro: values.logradouro || '',
                    bairro: values.bairro || '',
                    cidade: values.cidade || '',
                    estado: values.estado || '',
                    numero: parseInt(values.numero, 10) || 0,
                    complemento: values.complemento || '',
                    cep: values.cep || ''
                };
            } else if (values.tipo === "professor") {
                payload.cpf = values.cpf;
                payload.departamento = values.departamento;
                payload.instituicao_id = values.instituicao_id;
            } else if (values.tipo === "empresaparceira") {
                payload.cnpj = values.cnpj;
            }

            console.log("Payload enviado:", payload); // Log para verificar o payload enviado

            if (!payload.usuario.nome || !payload.usuario.email || !payload.usuario.senha) {
                message.error("Dados insuficientes. Verifique se todos os campos de usuário estão preenchidos.");
                return;
            }

            if (values.tipo === "empresaparceira" && !payload.cnpj) {
                message.error("O CNPJ é obrigatório para empresa parceira.");
                return;
            }
            // Determinar a rota com base no tipo de usuário
            let apiUrl;
            switch (values.tipo) {
                case "aluno":
                    apiUrl = 'http://localhost:3000/api/aluno';
                    break;
                case "professor":
                    apiUrl = 'http://localhost:3000/api/professor';
                    break;
                case "empresaparceira":
                    apiUrl = 'http://localhost:3000/api/empresaparceira';
                    break;
                default:
                    message.error("Tipo de usuário inválido!");
                    return;
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });


            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erro ao cadastrar:", errorData);
                throw new Error(errorData.message || 'Erro ao cadastrar usuário');
            } else {
                message.success('Usuário cadastrado com sucesso!');
                form.resetFields();
            }
        } catch (error) {
            console.error("Erro ao cadastrar:", error.message);
            message.error(`Erro ao cadastrar ${values.tipo}: ${error.message}`);
        }
    };


    const onFinish = (values) => {
        handleSubmit(values);
    };

    const cursos = ["Engenharia", "Ciência da Computação", "Administração", "Direito"];
    const departamentos = [
        { label: "Ensino", value: "Ensino" },
        { label: "Financeiro", value: "Financeiro" },
        { label: "Orientação", value: "Orientacao" },
        { label: "Coordenação", value: "Coordenacao" },
        { label: "Registro Acadêmico", value: "Registro_Academico" },
        { label: "Administrativo", value: "Administrativo" },
        { label: "Extensão", value: "Extensao" },
    ];

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
                    label="Nome"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, insira seu nome!',
                        },
                    ]}
                >
                    <Input placeholder="Nome" />
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

                <Form.Item label="Tipo de Usuário" name="tipo">
                    <Select placeholder="Selecione o tipo de usuário" onChange={handleUserTypeChange}>
                        <Option value="aluno">Aluno</Option>
                        <Option value="professor">Professor</Option>
                        <Option value="empresaparceira">Empresa Parceira</Option>
                    </Select>
                </Form.Item>

                {userType && renderUserSpecificFields(userType)}

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

    function renderUserSpecificFields(type) {
        switch (type) {
            case "aluno":
                return (
                    <>
                        <Form.Item label="CPF" name="cpf" rules={[{ required: true, message: 'CPF é obrigatório' }]}>
                            <Input placeholder="Digite o CPF" />
                        </Form.Item>
                        <Form.Item label="RG" name="rg" rules={[{ required: true, message: 'RG é obrigatório' }]}>
                            <Input placeholder="Digite o RG" />
                        </Form.Item>
                        <Form.Item label="Curso" name="curso" rules={[{ required: true, message: 'Curso é obrigatório' }]}>
                            <Select placeholder="Selecione o curso">
                                {cursos.map((curso) => (
                                    <Option key={curso} value={curso}>
                                        {curso}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        {renderEnderecoForm()}
                    </>
                );
            case "professor":
                return (
                    <>
                        <Form.Item label="CPF" name="cpf" rules={[{ required: true, message: 'CPF é obrigatório' }]}>
                            <Input placeholder="Digite o CPF" />
                        </Form.Item>

                        <Form.Item label="Departamento" name="departamento" rules={[{ required: true, message: 'Departamento é obrigatório' }]}>
                            <Select placeholder="Selecione o departamento">
                                {departamentos.map((departamento) => (
                                    <Option key={departamento.value} value={departamento.value}>
                                        {departamento.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Instituição" name="instituicao_id" rules={[{ required: true, message: 'Instituição é obrigatória' }]}>
                            <Select placeholder="Selecione a instituição">
                                {instituicoes.map((inst) => (
                                    <Option key={inst.idinstituicao} value={inst.idinstituicao}>
                                        {inst.nome}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </>
                );
            case "empresaparceira":
                return (
                    <Form.Item label="CNPJ" name="cnpj" rules={[{ required: true, message: 'CNPJ é obrigatório' }]}>
                        <Input placeholder="Digite o CNPJ" />
                    </Form.Item>
                );
            default:
                return null;
        }
    }

    function renderEnderecoForm() {
        return (
            <>
                <Form.Item label="Endereço">

                        <Form.Item name="cep" rules={[{ required: true, message: 'CEP é obrigatório' }]} style={{ width: '100%' }}>
                            <Input placeholder="CEP" />
                        </Form.Item>
                        

                </Form.Item>
                <Form.Item>
                    <Input.Group compact>
                    <Form.Item name="logradouro" rules={[{ required: true, message: 'Logradouro é obrigatório' }]} style={{ width: '50%' }}>
                            <Input placeholder="Logradouro" />
                        </Form.Item>
                        <Form.Item name="bairro" style={{ width: '50%' }}>
                            <Input placeholder="Bairro" />
                        </Form.Item>
                    </Input.Group>
                </Form.Item>

                <Form.Item>
                    <Input.Group compact>
                        <Form.Item name="numero" rules={[{ required: true, message: 'Número é obrigatório' }]} style={{ width: '50%' }}>
                            <Input placeholder="Número" />
                        </Form.Item>
                        <Form.Item name="complemento" style={{ width: '50%' }}>
                            <Input placeholder="Complemento" />
                        </Form.Item>
                    </Input.Group>
                </Form.Item>
                <Form.Item>
                    <Input.Group compact>
                        <Form.Item name="cidade" rules={[{ required: true, message: 'Cidade é obrigatória' }]} style={{ width: '50%' }}>
                            <Input placeholder="Cidade" />
                        </Form.Item>
                        <Form.Item name="estado" rules={[{ required: true, message: 'Estado é obrigatório' }]} style={{ width: '50%' }}>
                            <Input placeholder="Estado" />
                        </Form.Item>
                    </Input.Group>
                </Form.Item>
            </>
        );
    }
};

export default Cadastro;
