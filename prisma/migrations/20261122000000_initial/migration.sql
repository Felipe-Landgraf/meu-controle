-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Tipo" AS ENUM ('RECEITA', 'DESPESA');

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "Tipo" NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movimentacao" (
    "id" TEXT NOT NULL,
    "descricao" VARCHAR(120) NOT NULL,
    "valorCentavos" INTEGER NOT NULL,
    "data" DATE NOT NULL,
    "tipo" "Tipo" NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadaEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movimentacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_tipo_key" ON "Categoria"("nome", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_id_tipo_key" ON "Categoria"("id", "tipo");

-- CreateIndex
CREATE INDEX "Movimentacao_data_criadaEm_id_idx" ON "Movimentacao"("data", "criadaEm", "id");

-- CreateIndex
CREATE INDEX "Movimentacao_categoriaId_tipo_idx" ON "Movimentacao"("categoriaId", "tipo");

-- AddForeignKey
ALTER TABLE "Movimentacao" ADD CONSTRAINT "Movimentacao_categoriaId_tipo_fkey" FOREIGN KEY ("categoriaId", "tipo") REFERENCES "Categoria"("id", "tipo") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "Movimentacao" ADD CONSTRAINT "Movimentacao_valorCentavos_positivo" CHECK ("valorCentavos" > 0);
