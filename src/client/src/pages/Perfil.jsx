import React, { useEffect, useState } from "react";
import { Card, Descriptions, Button  } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom'; 
// import "../styles/Perfil.css";

const Perfil = () => {
    const [profileData, setProfileData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const { idUsuario } = useParams(); 
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/usuario/${idUsuario}`);
                if (response.ok) {
                    const data = await response.json();
                    setProfileData(data);
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

    return (
        <Card
            title="Perfil do Usuário"
            style={{ maxWidth: 600, margin: '20px auto', borderRadius: '8px' }}
        >
            {profileData ? (
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
                </Descriptions>
            ) : (
                <p>Carregando dados do perfil...</p>
            )}
        </Card>
    );
};

export default Perfil;
