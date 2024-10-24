import React, { useEffect, useState } from "react";
import { Card, Descriptions, Button, Input, message } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import AppHeader from "../components/Header";
import "../styles/Perfil.css";

const Perfil = () => {
    const [profileData, setProfileData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const { idUsuario } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({});

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/usuario/${idUsuario}`);
                if (response.ok) {
                    const data = await response.json();

                    // Fetch aluno data if available
                    if (data.aluno && data.aluno.length > 0) {
                        const alunoId = data.aluno[0].idaluno;
                        try {
                            const alunoResponse = await fetch(`http://localhost:3000/api/aluno/${alunoId}`);
                            if (alunoResponse.ok) {
                                const alunoData = await alunoResponse.json();
                                setProfileData({ ...data, aluno: [alunoData] });
                                setUserData({ ...data, aluno: [alunoData] });
                            } else {
                                console.error('Erro ao buscar dados do aluno');
                            }
                        } catch (error) {
                            console.error('Erro ao buscar dados do aluno:', error);
                        }
                    } 
                    // Fetch professor data if available
                    else if (data.professor && data.professor.length > 0) {
                        const professorId = data.professor[0].idprofessor;
                        try {
                            const professorResponse = await fetch(`http://localhost:3000/api/professor/${professorId}`);
                            if (professorResponse.ok) {
                                const professorData = await professorResponse.json();
                                setProfileData({ ...data, professor: [professorData] });
                                setUserData({ ...data, professor: [professorData] });
                            } else {
                                console.error('Erro ao buscar dados do professor');
                            }
                        } catch (error) {
                            console.error('Erro ao buscar dados do professor:', error);
                        }
                    } 
                    else if (data.empresaParceira && data.empresaParceira.length > 0) {
                        const empresaId = data.empresaParceira[0].idempresa;
                        try {
                            const empresaResponse = await fetch(`http://localhost:3000/api/empresaparceira/${empresaId}`);
                            if (empresaResponse.ok) {
                                const empresaData = await empresaResponse.json();
                                setProfileData({ ...data, empresaParceira: [empresaData] });
                                setUserData({ ...data, empresaParceira: [empresaData] });
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
                    console.error('Erro ao buscar dados do perfil');
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
        const [parent, key] = name.split('.');

        if (parent && key) {
            setUserData((prevData) => ({
                ...prevData,
                [parent]: {
                    ...prevData[parent],
                    [key]: value,
                },
            }));
        } else {
            setUserData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/usuario/${idUsuario}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const updatedData = await response.json();
                setProfileData(updatedData);
                setIsEditing(false);
                message.success('Perfil atualizado com sucesso!');
            } else {
                message.error('Erro ao atualizar o perfil');
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            message.error('Erro ao atualizar perfil');
        }
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
        } else if (profileData?.empresaParceira?.length > 0) {
            const empresaParceira = profileData.empresaParceira[0];
            return (
                <>
                    <Descriptions.Item label="Tipo de Usuário">Empresa Parceira</Descriptions.Item>
                    {renderEmpresaFields(empresaParceira)}
                </>
            );
        }
        return null;
    };

    const renderAlunoFields = (aluno, endereco) => (
        <>
            <Descriptions.Item label="CPF">
                {isEditing ? (
                    <Input name="aluno.cpf" value={userData.aluno?.cpf} onChange={handleInputChange} />
                ) : (
                    aluno.cpf
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
                    <Input name="aluno.curso" value={userData.aluno?.curso} onChange={handleInputChange} />
                ) : (
                    aluno.curso
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Saldo Moedas">
                {isEditing ? (
                    <Input name="aluno.saldomoedas" value={userData.aluno?.saldomoedas} onChange={handleInputChange} />
                ) : (
                    aluno.saldomoedas
                )}
            </Descriptions.Item>
            <Descriptions.Item label="CEP">
                {isEditing ? (
                    <Input name="aluno.endereco.cep" value={userData.aluno?.endereco?.cep} onChange={handleInputChange} />
                ) : (
                    endereco.cep || 'Não informado'
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Logradouro">
                {isEditing ? (
                    <Input name="aluno.endereco.logradouro" value={userData.aluno?.endereco?.logradouro} onChange={handleInputChange} />
                ) : (
                    endereco.logradouro || 'Não informado'
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Número">
                {isEditing ? (
                    <Input name="aluno.endereco.numero" value={userData.aluno?.endereco?.numero} onChange={handleInputChange} />
                ) : (
                    endereco.numero || 'Não informado'
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Complemento">
                {isEditing ? (
                    <Input name="aluno.endereco.complemento" value={userData.aluno?.endereco?.complemento} onChange={handleInputChange} />
                ) : (
                    endereco.complemento || 'Não informado'
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Cidade">
                {isEditing ? (
                    <Input name="aluno.endereco.cidade" value={userData.aluno?.endereco?.cidade} onChange={handleInputChange} />
                ) : (
                    endereco.cidade || 'Não informado'
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Estado">
                {isEditing ? (
                    <Input name="aluno.endereco.estado" value={userData.aluno?.endereco?.estado} onChange={handleInputChange} />
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
                    <Input name="professor.departamento" value={userData.professor?.departamento} onChange={handleInputChange} />
                ) : (
                    professor.departamento
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Instituição">
                {isEditing ? (
                    <Input name="professor.instituicao_id" value={userData.professor?.instituicao_id} onChange={handleInputChange} />
                ) : (
                    professor.instituicao_id
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Saldo Moedas">
                {isEditing ? (
                    <Input name="professor.saldomoedas" value={userData.professor?.saldomoedas} onChange={handleInputChange} />
                ) : (
                    professor.saldomoedas
                )}
            </Descriptions.Item>
        </>
    );

    const renderEmpresaFields = (empresaParceira) => (
        <>
            <Descriptions.Item label="CNPJ">
                {isEditing ? (
                    <Input 
                        name="empresaParceira.cnpj" 
                        value={userData.empresaParceira?.cnpj} 
                        onChange={handleInputChange} 
                    />
                ) : (
                    empresaParceira.cnpj
                )}
            </Descriptions.Item>
        </>
    );
    


    return (
        <>
            <AppHeader />
            <div className="profile-container">
                <Card
                    title="Perfil do Usuário"
                    bordered
                    extra={
                        isEditing ? (
                            <>
                                <Button type="primary" onClick={handleSave}>Salvar</Button>
                                <Button style={{ marginLeft: '10px' }} onClick={() => setIsEditing(false)}>Cancelar</Button>
                            </>
                        ) : (
                            <Button type="primary" onClick={() => setIsEditing(true)}>Editar</Button>
                        )
                    }
                >
                    {profileData ? (
                        <>
                            <Descriptions bordered column={2}>
                                <Descriptions.Item label="Nome">
                                    {isEditing ? (
                                        <Input name="nome" value={userData.nome} onChange={handleInputChange} />
                                    ) : (
                                        profileData.nome
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="E-mail">
                                    {isEditing ? (
                                        <Input name="email" value={userData.email} onChange={handleInputChange} />
                                    ) : (
                                        profileData.email
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="Senha">
                                    {showPassword ? (
                                        isEditing ? (
                                            <Input.Password name="senha" value={userData.senha} onChange={handleInputChange} />
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
                                        style={{ marginLeft: 10 }}
                                    />
                                </Descriptions.Item>
                                {renderSpecificData()}
                            </Descriptions>
                        </>
                    ) : (
                        <p>Carregando dados do perfil...</p>
                    )}
                </Card>
            </div>
        </>
    );
};

export default Perfil;
