import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Exemplo: "Bearer TOKEN"
    
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, 'sismoeda'); // Certifique-se de usar sua chave secreta JWT
        req.userId = decoded.idusuario; // Coloca o ID do usuário no request
        next(); // Chama a próxima função/middleware
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
}

export default authMiddleware;
