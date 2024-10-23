-- CreateEnum
CREATE TYPE "departamento" AS ENUM ('Ensino', 'Financeiro', 'Orientacao', 'Coordenacao', 'Registro_Academico', 'Administrativo', 'Extensao');

-- CreateEnum
CREATE TYPE "tipotransacao" AS ENUM ('EnvioMoedas', 'RecebimentoMoedas', 'TrocaMoedas');

-- CreateTable
CREATE TABLE "usuario" (
    "idusuario" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("idusuario")
);

-- CreateTable
CREATE TABLE "aluno" (
    "idaluno" SERIAL NOT NULL,
    "cpf" VARCHAR(14) NOT NULL,
    "rg" VARCHAR(12) NOT NULL,
    "curso" VARCHAR(255),
    "saldomoedas" DOUBLE PRECISION,
    "endereco_id" INTEGER,
    "usuario_id" INTEGER,

    CONSTRAINT "aluno_pkey" PRIMARY KEY ("idaluno")
);

-- CreateTable
CREATE TABLE "professor" (
    "idprofessor" SERIAL NOT NULL,
    "cpf" VARCHAR(14) NOT NULL,
    "departamento" "departamento",
    "instituicao_id" INTEGER,
    "saldomoedas" DOUBLE PRECISION,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "professor_pkey" PRIMARY KEY ("idprofessor")
);

-- CreateTable
CREATE TABLE "empresaparceira" (
    "idempresa" SERIAL NOT NULL,
    "cnpj" VARCHAR(18) NOT NULL,
    "nomeempresa" VARCHAR(255) NOT NULL,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "empresaparceira_pkey" PRIMARY KEY ("idempresa")
);

-- CreateTable
CREATE TABLE "endereco" (
    "idendereco" SERIAL NOT NULL,
    "logradouro" VARCHAR(255) NOT NULL,
    "bairro" VARCHAR(255) NOT NULL,
    "cidade" VARCHAR(255) NOT NULL,
    "estado" VARCHAR(255) NOT NULL,
    "numero" INTEGER,
    "complemento" VARCHAR(255),
    "cep" VARCHAR(10),

    CONSTRAINT "endereco_pkey" PRIMARY KEY ("idendereco")
);

-- CreateTable
CREATE TABLE "instituicao" (
    "idinstituicao" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "endereco_id" INTEGER NOT NULL,

    CONSTRAINT "instituicao_pkey" PRIMARY KEY ("idinstituicao")
);

-- CreateTable
CREATE TABLE "transacao" (
    "idtransacao" SERIAL NOT NULL,
    "tipo" "tipotransacao" NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "data" TIMESTAMP(6) NOT NULL,
    "aluno_id" INTEGER,
    "professor_id" INTEGER,

    CONSTRAINT "transacao_pkey" PRIMARY KEY ("idtransacao")
);

-- CreateTable
CREATE TABLE "vantagem" (
    "idvantagem" SERIAL NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "customoedas" DOUBLE PRECISION NOT NULL,
    "foto" VARCHAR(255),
    "empresaparceira_id" INTEGER,

    CONSTRAINT "vantagem_pkey" PRIMARY KEY ("idvantagem")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "aluno_cpf_key" ON "aluno"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "professor_cpf_key" ON "professor"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "professor_usuario_id_key" ON "professor"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "empresaparceira_cnpj_key" ON "empresaparceira"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "empresaparceira_usuario_id_key" ON "empresaparceira"("usuario_id");

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_endereco_id_fkey" FOREIGN KEY ("endereco_id") REFERENCES "endereco"("idendereco") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("idusuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor" ADD CONSTRAINT "professor_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("idusuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor" ADD CONSTRAINT "fk_instituicao" FOREIGN KEY ("instituicao_id") REFERENCES "instituicao"("idinstituicao") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empresaparceira" ADD CONSTRAINT "empresaparceira_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("idusuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instituicao" ADD CONSTRAINT "fk_endereco_instituicao" FOREIGN KEY ("endereco_id") REFERENCES "endereco"("idendereco") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transacao" ADD CONSTRAINT "fk_aluno" FOREIGN KEY ("aluno_id") REFERENCES "aluno"("idaluno") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transacao" ADD CONSTRAINT "fk_professor" FOREIGN KEY ("professor_id") REFERENCES "professor"("idprofessor") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vantagem" ADD CONSTRAINT "fk_empresaparceira" FOREIGN KEY ("empresaparceira_id") REFERENCES "empresaparceira"("idempresa") ON DELETE NO ACTION ON UPDATE NO ACTION;
