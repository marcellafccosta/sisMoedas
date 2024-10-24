import React, { useEffect, useState } from "react";
import { Card, Descriptions, Button } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import AppHeader from "../components/Header";
import "../styles/Perfil.css";

const Perfil = () => {
    const [profileData, setProfileData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const { idUsuario } = useParams();

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
                    setProfileData(data);
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

    const renderSpecificData = () => {
        if (profileData.aluno.length > 0) {
            const aluno = profileData.aluno[0];
            return (
                <>
                    <Descriptions.Item label="Tipo de Usuário">Aluno</Descriptions.Item>
                    <Descriptions.Item label="CPF">{aluno.cpf}</Descriptions.Item>
                    <Descriptions.Item label="RG">{aluno.rg}</Descriptions.Item>
                    <Descriptions.Item label="Curso">{aluno.curso}</Descriptions.Item>
                </>
            );
        } else if (profileData.professor.length > 0) {
            const professor = profileData.professor[0];
            return (
                <>
                    <Descriptions.Item label="Tipo de Usuário">Professor</Descriptions.Item>
                    <Descriptions.Item label="CPF">{professor.cpf}</Descriptions.Item>
                    <Descriptions.Item label="Departamento">{professor.departamento}</Descriptions.Item>
                    <Descriptions.Item label="Instituição ID">{professor.instituicao_id}</Descriptions.Item>
                </>
            );
        } else if (profileData.empresa.length > 0) {
            const empresa = profileData.empresa[0];
            return (
                <>
                    <Descriptions.Item label="Tipo de Usuário">Empresa Parceira</Descriptions.Item>
                    <Descriptions.Item label="CNPJ">{empresa.cnpj}</Descriptions.Item>
                </>
            );
        }
        return null;
    };

    return (
        <>
            <AppHeader />
            <div className="profile-container">
                <Card title="Perfil do Usuário" bordered>
                    {profileData ? (
                        <>
                            <Descriptions bordered column={1}>
                                <Descriptions.Item label="Nome">{profileData.nome}</Descriptions.Item>
                                <Descriptions.Item label="E-mail">{profileData.email}</Descriptions.Item>
                                <Descriptions.Item label="Senha">
                                    {showPassword ? profileData.senha : '******'}
                                    <Button
                                        type="link"
                                        onClick={togglePasswordVisibility}
                                        icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                        style={{ marginLeft: 10 }}
                                    />
                                </Descriptions.Item>
                                {profileData.endereco && (
                                    <>
                                        <Descriptions.Item label="Logradouro">{profileData.endereco.logradouro}</Descriptions.Item>
                                        <Descriptions.Item label="Bairro">{profileData.endereco.bairro}</Descriptions.Item>
                                        <Descriptions.Item label="Cidade">{profileData.endereco.cidade}</Descriptions.Item>
                                        <Descriptions.Item label="Estado">{profileData.endereco.estado}</Descriptions.Item>
                                        <Descriptions.Item label="Número">{profileData.endereco.numero}</Descriptions.Item>
                                        <Descriptions.Item label="Complemento">{profileData.endereco.complemento}</Descriptions.Item>
                                        <Descriptions.Item label="CEP">{profileData.endereco.cep}</Descriptions.Item>
                                    </>
                                )}
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
