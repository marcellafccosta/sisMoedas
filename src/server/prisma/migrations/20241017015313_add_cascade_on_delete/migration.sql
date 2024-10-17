/*
  Warnings:

  - A unique constraint covering the columns `[usuario_id]` on the table `aluno` will be added. If there are existing duplicate values, this will fail.
  - Made the column `endereco_id` on table `aluno` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usuario_id` on table `aluno` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "aluno" DROP CONSTRAINT "aluno_endereco_id_fkey";

-- DropForeignKey
ALTER TABLE "aluno" DROP CONSTRAINT "aluno_usuario_id_fkey";

-- AlterTable
ALTER TABLE "aluno" ALTER COLUMN "endereco_id" SET NOT NULL,
ALTER COLUMN "usuario_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "aluno_usuario_id_key" ON "aluno"("usuario_id");

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("idusuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_endereco_id_fkey" FOREIGN KEY ("endereco_id") REFERENCES "endereco"("idendereco") ON DELETE RESTRICT ON UPDATE CASCADE;
