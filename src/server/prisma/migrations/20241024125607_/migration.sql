-- CreateTable
CREATE TABLE `usuario` (
    `idusuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `usuario_email_key`(`email`),
    PRIMARY KEY (`idusuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aluno` (
    `idaluno` INTEGER NOT NULL AUTO_INCREMENT,
    `cpf` VARCHAR(14) NOT NULL,
    `rg` VARCHAR(12) NOT NULL,
    `curso` VARCHAR(255) NULL,
    `saldomoedas` DOUBLE NULL,
    `usuario_id` INTEGER NOT NULL,
    `endereco_id` INTEGER NOT NULL,

    UNIQUE INDEX `aluno_cpf_key`(`cpf`),
    UNIQUE INDEX `aluno_usuario_id_key`(`usuario_id`),
    PRIMARY KEY (`idaluno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `professor` (
    `idprofessor` INTEGER NOT NULL AUTO_INCREMENT,
    `cpf` VARCHAR(14) NOT NULL,
    `departamento` ENUM('Ensino', 'Financeiro', 'Orientacao', 'Coordenacao', 'Registro_Academico', 'Administrativo', 'Extensao') NULL,
    `instituicao_id` INTEGER NULL,
    `saldomoedas` DOUBLE NULL,
    `usuario_id` INTEGER NOT NULL,

    UNIQUE INDEX `professor_cpf_key`(`cpf`),
    UNIQUE INDEX `professor_usuario_id_key`(`usuario_id`),
    PRIMARY KEY (`idprofessor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresaparceira` (
    `idempresa` INTEGER NOT NULL AUTO_INCREMENT,
    `cnpj` VARCHAR(18) NOT NULL,
    `usuario_id` INTEGER NOT NULL,

    UNIQUE INDEX `empresaparceira_cnpj_key`(`cnpj`),
    UNIQUE INDEX `empresaparceira_usuario_id_key`(`usuario_id`),
    PRIMARY KEY (`idempresa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `endereco` (
    `idendereco` INTEGER NOT NULL AUTO_INCREMENT,
    `logradouro` VARCHAR(255) NOT NULL,
    `bairro` VARCHAR(255) NOT NULL,
    `cidade` VARCHAR(255) NOT NULL,
    `estado` VARCHAR(255) NOT NULL,
    `numero` INTEGER NULL,
    `complemento` VARCHAR(255) NULL,
    `cep` VARCHAR(10) NULL,

    PRIMARY KEY (`idendereco`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `instituicao` (
    `idinstituicao` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `endereco_id` INTEGER NOT NULL,

    PRIMARY KEY (`idinstituicao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transacao` (
    `idtransacao` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('EnvioMoedas', 'RecebimentoMoedas', 'TrocaMoedas') NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `data` TIMESTAMP(6) NOT NULL,
    `aluno_id` INTEGER NULL,
    `professor_id` INTEGER NULL,
    `motivo` TEXT NULL,

    PRIMARY KEY (`idtransacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vantagem` (
    `idvantagem` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(255) NOT NULL,
    `customoedas` DOUBLE NOT NULL,
    `foto` VARCHAR(255) NULL,
    `empresaparceira_id` INTEGER NULL,

    PRIMARY KEY (`idvantagem`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AlunoVantagem` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AlunoVantagem_AB_unique`(`A`, `B`),
    INDEX `_AlunoVantagem_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `aluno` ADD CONSTRAINT `aluno_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aluno` ADD CONSTRAINT `aluno_endereco_id_fkey` FOREIGN KEY (`endereco_id`) REFERENCES `endereco`(`idendereco`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professor` ADD CONSTRAINT `professor_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professor` ADD CONSTRAINT `fk_instituicao` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicao`(`idinstituicao`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `empresaparceira` ADD CONSTRAINT `empresaparceira_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `instituicao` ADD CONSTRAINT `fk_endereco_instituicao` FOREIGN KEY (`endereco_id`) REFERENCES `endereco`(`idendereco`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transacao` ADD CONSTRAINT `fk_aluno` FOREIGN KEY (`aluno_id`) REFERENCES `aluno`(`idaluno`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transacao` ADD CONSTRAINT `fk_professor` FOREIGN KEY (`professor_id`) REFERENCES `professor`(`idprofessor`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `vantagem` ADD CONSTRAINT `fk_empresaparceira` FOREIGN KEY (`empresaparceira_id`) REFERENCES `empresaparceira`(`idempresa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `_AlunoVantagem` ADD CONSTRAINT `_AlunoVantagem_A_fkey` FOREIGN KEY (`A`) REFERENCES `aluno`(`idaluno`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AlunoVantagem` ADD CONSTRAINT `_AlunoVantagem_B_fkey` FOREIGN KEY (`B`) REFERENCES `vantagem`(`idvantagem`) ON DELETE CASCADE ON UPDATE CASCADE;
