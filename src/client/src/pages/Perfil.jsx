import React, { useEffect, useState } from "react";
import { Descriptions, Button, Input, message, Card, Modal } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useParams, Link } from 'react-router-dom';
import AppHeader from "../components/Header";
import "../styles/Perfil.css";
import { Typography, Grid } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
    const [profileData, setProfileData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const { idUsuario } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            console.log('ID do usuário:', idUsuario); // Log para verificar o ID
            try {
                const response = await fetch(`http://localhost:3000/api/usuario/${idUsuario}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Dados recebidos:', data);
                    setProfileData(data);
                    setUserData({
                        ...data,
                        aluno: data.aluno ? { ...data.aluno[0] } : {}
                    });

                    if (data.aluno && data.aluno.length > 0) {
                        const alunoId = data.aluno[0].idaluno;
                        const alunoResponse = await fetch(`http://localhost:3000/api/aluno/${alunoId}`);
                        if (alunoResponse.ok) {
                            const alunoData = await alunoResponse.json();
                            setProfileData({ ...data, aluno: [alunoData] });
                            setUserData({ ...data, aluno: [alunoData] });
                        }
                    } else if (data.professor && data.professor.length > 0) {
                        const professorId = data.professor[0].idprofessor;
                        console.log('ID Professor:', professorId); // Verifique se o ID é válido
                        const professorResponse = await fetch(`http://localhost:3000/api/professor/${professorId}`);
                        if (professorResponse.ok) {
                            const professorData = await professorResponse.json();
                            setProfileData({ ...data, professor: [professorData] });
                            setUserData({ ...data, professor: [professorData] });
                        }
                    }
                    else if (data.empresa && data.empresa.length > 0) {
                        const empresaId = data.empresa[0].idempresa;
                        try {
                            const empresaResponse = await fetch(`http://localhost:3000/api/empresaparceira/${empresaId}`);
                            if (empresaResponse.ok) {
                                const empresaData = await empresaResponse.json();
                                setProfileData({ ...data, empresa: [empresaData] });
                                setUserData({ ...data, empresa: [empresaData] });
                            } else {
                                console.error('Erro ao buscar dados da empresa');
                            }
                        } catch (error) {
                            console.error('Erro ao buscar dados da empresa:', error);
                        }
                    } else {
                        setProfileData(data);
                        setUserData(data);
                    }
                } else {
                    console.error('Erro ao buscar dados do perfil', response.status); // Logar o status de erro
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
            }
        };

        if (idUsuario) {
            fetchProfileData();
        }
    }, [idUsuario]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');

        setUserData((prevData) => {
            let updatedData = { ...prevData };
            let current = updatedData;

            // Navega pelo objeto até chegar na chave final
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {}; // Cria o objeto se não existir
                }
                current = current[keys[i]];
            }

            // Atualiza o valor da última chave
            current[keys[keys.length - 1]] = value;

            return updatedData;
        });
    };



    const handleEdit = () => {
        setUserData({
            ...profileData,
            aluno: profileData.aluno ? { ...profileData.aluno[0] } : {},
            professor: profileData.professor ? { ...profileData.professor[0] } : {},
            empresa: profileData.empresa ? { ...profileData.empresa[0] } : {}

        });
        setIsEditing(true);
    };


    const handleSave = async () => {
        try {
            let url = '';
            let dataToSend = {};

            if (userData.aluno && userData.aluno.idaluno) {
                url = `http://localhost:3000/api/aluno/${userData.aluno.idaluno}`;
                dataToSend = { ...userData.aluno };
            } else if (userData.professor && userData.professor.idprofessor) {
                console.log('Dados do professor enviados:', userData.professor); // Log dos dados do professor
                url = `http://localhost:3000/api/professor/${userData.professor.idprofessor}`;
                dataToSend = { ...userData.professor };
            } else if (userData.empresa && userData.empresa.idempresa) {
                url = `http://localhost:3000/api/empresaparceira/${userData.empresa.idempresa}`;
                dataToSend = { ...userData.empresa };
            } else {
                url = `http://localhost:3000/api/usuario/${idUsuario}`;
                dataToSend = { ...userData };
            }

            console.log('URL:', url);
            console.log('Dados enviados:', dataToSend);

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                const updatedData = await response.json();
                setProfileData(updatedData);
                setIsEditing(false);
                message.success('Perfil atualizado com sucesso!');
            } else {
                console.error(`Erro ao atualizar o perfil: ${response.status}`);
                message.error('Erro ao atualizar o perfil');
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            message.error('Erro ao atualizar perfil');
        }
    };

    const handleDeleteAccount = async () => {
        Modal.confirm({
            title: 'Confirmar Exclusão',
            content: 'Tem certeza de que deseja deletar esta conta? Esta ação não pode ser desfeita.',
            okText: 'Deletar',
            okType: 'danger',
            
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    const response = await fetch(`http://localhost:3000/api/usuario/${idUsuario}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        message.success('Conta deletada com sucesso!');
                        navigate('/');
                    } else {
                        message.error('Erro ao deletar a conta');
                    }
                } catch (error) {
                    console.error('Erro ao deletar conta:', error);
                    message.error('Erro ao deletar conta');
                }
            },
        });
    };



    const renderSpecificData = () => {
        if (profileData?.aluno?.length > 0) {
            const aluno = profileData.aluno[0];
            const endereco = aluno.endereco || {};
            return (
                <>
                    <Descriptions.Item label="Tipo de Usuário">Aluno</Descriptions.Item>
                    {renderAlunoFields(aluno, endereco)}
                </>
            );
        } else if (profileData?.professor?.length > 0) {
            const professor = profileData.professor[0];
            return (
                <>
                    <Descriptions.Item label="Tipo de Usuário">Professor</Descriptions.Item>
                    {renderProfessorFields(professor)}
                </>
            );
        } else if (profileData?.empresa?.length > 0) {
            const empresa = profileData.empresa[0];
            return (
                <>
                    <Descriptions.Item label="Tipo de Usuário">Empresa Parceira</Descriptions.Item>
                    {renderEmpresaFields(empresa)}
                </>
            );
        }
        return null;
    };


    const renderAlunoFields = (aluno, endereco) => (
        <>
            <Descriptions.Item label="CPF">
                {isEditing ? (
                    <Input
                        name="aluno.cpf"
                        value={userData.aluno?.cpf || ''}
                    />
                ) : (
                    aluno?.cpf || 'Não informado'
                )}
            </Descriptions.Item>





            <Descriptions.Item label="RG">
                {isEditing ? (
                    <Input name="aluno.rg" value={userData.aluno?.rg} onChange={handleInputChange} />
                ) : (
                    aluno.rg
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Curso">
                {isEditing ? (
                    <Input name="aluno.curso" value={userData.aluno?.curso} onChange={handleInputChange} disabled />
                ) : (
                    aluno.curso
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Saldo Moedas">
                {isEditing ? (
                    <Input name="aluno.saldomoedas" value={userData.aluno?.saldomoedas} onChange={handleInputChange} disabled />
                ) : (
                    aluno.saldomoedas
                )}
            </Descriptions.Item>
            <Descriptions.Item label="CEP">
                {isEditing ? (
                    <Input name="aluno.endereco.cep" value={userData.aluno?.endereco?.cep || ''} onChange={handleInputChange} />
                ) : (
                    endereco.cep || 'Não informado'
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Logradouro">
                {isEditing ? (
                    <Input name="aluno.endereco.logradouro" value={userData.aluno?.endereco?.logradouro || ''} onChange={handleInputChange} />
                ) : (
                    endereco.logradouro || 'Não informado'
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Número">
                {isEditing ? (
                    <Input name="aluno.endereco.numero" value={userData.aluno?.endereco?.numero || ''} onChange={handleInputChange} />
                ) : (
                    endereco.numero || 'Não informado'
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Complemento">
                {isEditing ? (
                    <Input name="aluno.endereco.complemento" value={userData.aluno?.endereco?.complemento || ''} onChange={handleInputChange} />
                ) : (
                    endereco.complemento || 'Não informado'
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Cidade">
                {isEditing ? (
                    <Input name="aluno.endereco.cidade" value={userData.aluno?.endereco?.cidade || ''} onChange={handleInputChange} />
                ) : (
                    endereco.cidade || 'Não informado'
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Estado">
                {isEditing ? (
                    <Input name="aluno.endereco.estado" value={userData.aluno?.endereco?.estado || ''} onChange={handleInputChange} />
                ) : (
                    endereco.estado || 'Não informado'
                )}
            </Descriptions.Item>

        </>
    );

    const renderProfessorFields = (professor) => (
        <>
            <Descriptions.Item label="CPF">
                {isEditing ? (
                    <Input name="professor.cpf" value={userData.professor?.cpf} onChange={handleInputChange} />
                ) : (
                    professor.cpf
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Departamento">
                {isEditing ? (
                    <Input name="professor.departamento" value={userData.professor?.departamento} onChange={handleInputChange} disabled />
                ) : (
                    professor.departamento
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Instituição">
                {isEditing ? (
                    <Input name="professor.instituicao_id" value={userData.professor?.instituicao_id} onChange={handleInputChange} disabled />
                ) : (
                    professor.instituicao_id
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Saldo Moedas">
                {isEditing ? (
                    <Input name="professor.saldomoedas"
                        value={userData.professor?.saldomoedas} onChange={handleInputChange} disabled />
                ) : (
                    professor.saldomoedas
                )}
            </Descriptions.Item>
        </>
    );

    const renderEmpresaFields = (empresa) => (
        <Descriptions.Item label="CNPJ">
            {isEditing ? (
                <Input
                    name="empresa.cnpj"
                    value={userData.empresa?.cnpj}
                    onChange={handleInputChange}
                />
            ) : (
                empresa?.cnpj || 'Não informado'
            )}
        </Descriptions.Item>
    );

    const renderVantagensGrid = (empresa) => {

        if (empresa?.vantagem?.length > 0) {
            return (
                <div className="vantagens-grid-container">
                    <Grid container spacing={5}>
                        {empresa.vantagem.map((vantagem, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Link to={`/VantagemDetalhe/${vantagem.idvantagem}`} style={{ textDecoration: "none" }}>
                                    <Card
                                        hoverable
                                        className="vantagem-card"
                                    >
                                        <div className="vantagem-image-container">
                                            <img
                                                src={`http://localhost:3000/${vantagem.foto}`}
                                                alt={vantagem.descricao}
                                                className="vantagem-image"
                                            />
                                        </div>
                                        <div className="vantagem-details">
                                            <Typography variant="h6" component="h2" className="vantagem-description">
                                                {vantagem.descricao}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Custo: {vantagem.customoedas} moedas
                                            </Typography>
                                        </div>
                                    </Card>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            );
        } else {
            return <p style={{ marginTop: '20px' }}>Não há vantagens cadastradas</p>;
        }
    };




    return (
        <><AppHeader /><div className="profile-container">
            <Card
                title="Perfil do Usuário"
                bordered
                style={{ width: '100%', maxWidth: '800px', height: 'fit-content' }} // Ajuste aqui para garantir que o Card também se ajuste ao conteúdo
                extra={isEditing ? (
                    <>
                        <Button type="primary" onClick={handleSave}>Salvar</Button>
                        <Button style={{ marginLeft: '10px' }} onClick={() => setIsEditing(false)}>Cancelar</Button>
                    </>
                ) : (
                    <><Button type="primary" onClick={handleEdit}>Editar</Button>
                        <Button type="danger" style={{ marginLeft: '10px', backgroundColor: "#a22020", color: "white" }} onClick={handleDeleteAccount}>Deletar Conta</Button></>
                )}
            >
                {profileData ? (
                    <>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Nome">
                                {isEditing ? (
                                    <Input name="nome" value={userData.nome || ''} onChange={handleInputChange} />
                                ) : (
                                    profileData.nome
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="E-mail">
                                {isEditing ? (
                                    <Input name="email" value={userData.email || ''} onChange={handleInputChange} />
                                ) : (
                                    profileData.email
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Senha">
                                {showPassword ? (
                                    isEditing ? (
                                        <Input.Password name="senha" value={userData.senha || ''} onChange={handleInputChange} />
                                    ) : (
                                        profileData.senha
                                    )
                                ) : (
                                    '******'
                                )}
                                <Button
                                    type="link"
                                    onClick={togglePasswordVisibility}
                                    icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                    style={{ marginLeft: 10 }} />
                            </Descriptions.Item>
                            {renderSpecificData()}
                        </Descriptions>
                        {profileData?.empresa?.length > 0 && (
                            <div>
                                <h2 className="vantagens">Vantagens</h2>
                                {renderVantagensGrid(profileData.empresa[0])}
                            </div>
                        )}
                    </>
                ) : (
                    <p>Carregando dados do perfil...</p>
                )}
            </Card>
        </div></>
    );
};

export default Perfil;