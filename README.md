# Desafio de desenvolvimento

Solução em TypeScript com Node.js.

## Requisito

- Node.js 18 ou superior
- Dependências do projeto instaladas com `npm install`

## Como executar

### 1. Comissões

```bash
npm run comissoes
```

O programa lê `data/vendas.json` e exibe o total de comissão por vendedor.

### 2. Estoque

Modo interativo:

```bash
npm run estoque
```

Também é possível informar os dados diretamente no terminal:

```bash
npm run estoque -- 101 entrada 20 "Reposição de estoque"
```

O identificador é gerado sequencialmente durante a execução. Saídas que deixariam o estoque negativo são recusadas.

### 3. Juros

```bash
npm run juros -- 100 2026-10-01
```

Informe o valor e a data de vencimento no formato `AAAA-MM-DD`. O cálculo usa multa de 2,5% por dia de atraso até a data atual.

## Verificação de tipos

```bash
npm run verificar
```
