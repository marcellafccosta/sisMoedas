import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;

bcrypt.hash('senha123', SALT_ROUNDS).then(hash => {
    console.log('Senha criptografada:', hash);
});