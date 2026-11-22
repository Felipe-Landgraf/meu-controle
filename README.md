# Meu Controle

Aplicação local para registrar receitas e despesas. O dashboard mostra o saldo, gráficos e as cinco movimentações mais recentes do mês escolhido. Em **Movimentações**, use a busca e os filtros para consultar, editar ou excluir registros.

## Executar localmente

1. Tenha Node.js **20.9 ou superior**, npm e PostgreSQL. Para usar o banco fornecido pelo projeto, instale também Docker com Compose.
2. Na raiz do projeto, instale as dependências e crie o arquivo de configuração.

   ```sh
   npm ci
   cp .env.example .env
   ```

   No PowerShell, execute:

   ```powershell
   npm.cmd ci
   Copy-Item .env.example .env
   ```

   O `npm.cmd` funciona quando a política de execução do PowerShell bloqueia o script `npm.ps1`.

3. Suba o PostgreSQL e aguarde o banco aceitar conexões.

   ```sh
   docker compose up -d --wait db
   ```

   Se já tiver PostgreSQL, crie um banco vazio e ajuste `DATABASE_URL` em `.env` para apontar para ele. Para reproduzir a configuração do Compose em um servidor local novo, abra `psql` com um usuário administrador e execute:

   ```sql
   CREATE ROLE meu_controle LOGIN PASSWORD 'meu_controle';
   CREATE DATABASE meu_controle OWNER meu_controle;
   ```

4. Aplique a migração, carregue as categorias e os exemplos, e inicie a aplicação.

   ```sh
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

   No PowerShell, execute:

   ```powershell
   npm.cmd run db:migrate
   npm.cmd run db:seed
   npm.cmd run dev
   ```

5. Abra [Meu Controle no navegador](http://localhost:3000).

O seed inclui movimentações fictícias no mês atual e no anterior. Ele usa identificadores estáveis por mês e não duplica registros de demonstração que já existem. Mantenha o volume do Compose para preservar os dados entre reinícios do PostgreSQL.

## Verificar o projeto

```sh
npm run typecheck
npm run lint
npm run build
```

No PowerShell, use `npm.cmd` nesses comandos. Depois do build, inicie a versão de produção com `npm start` ou `npm.cmd start` no PowerShell.

## Demonstração pública

[Abrir Meu Controle](https://felipe-landgraf.github.io/meu-controle/)

A demonstração usa a mesma interface, regras de validação e exemplos da aplicação local. Ela funciona sem servidor e salva as alterações no navegador do visitante. Use valores fictícios ao experimentar.

```sh
npm run demo:build
npm run demo:preview
```

O GitHub Pages publica a versão de demonstração por meio do workflow em `.github/workflows/demo.yml`.

## Organização do código

- `src/app` contém as rotas e o layout do App Router.
- `src/features/finance` contém as consultas, ações de servidor, validação Zod e componentes do dashboard e das movimentações.
- `src/components` contém a navegação e o seletor de período.
- `src/lib` contém a conexão Prisma e as funções para datas de calendário e centavos.
- `prisma` contém o schema, a migração SQL e os dados de demonstração.

O PostgreSQL usa `DATE` para a data da movimentação e inteiro para o valor em centavos. As consultas mensais incluem o primeiro dia do mês e excluem o do mês seguinte. A data sugerida para um novo registro e o mês inicial usam o calendário de São Paulo. Os dias salvos são exibidos sem conversão para o fuso do navegador. A chave estrangeira composta garante a compatibilidade entre categoria e tipo também no banco.

O app foi configurado para uso individual sem autenticação e escuta apenas no endereço local.
