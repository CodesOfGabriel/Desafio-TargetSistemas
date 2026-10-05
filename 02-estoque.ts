import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import dadosEstoque from './data/estoque.json';

type TipoMovimentacao = 'entrada' | 'saida';

type Produto = {
  codigoProduto: number;
  descricaoProduto: string;
  estoque: number;
};

type Movimentacao = {
  id: number;
  codigoProduto: number;
  tipo: TipoMovimentacao;
  descricao: string;
  quantidade: number;
};

const estoque: Produto[] = dadosEstoque.estoque;
const movimentacoes: Movimentacao[] = [];

function registrarMovimentacao(
  codigoProduto: string,
  tipo: string,
  quantidade: string,
  descricao: string
): { movimentacao: Movimentacao; produto: Produto } {
  const produto = estoque.find((item) => item.codigoProduto === Number(codigoProduto));
  const tipoNormalizado = tipo.toLowerCase();
  const quantidadeNumerica = Number(quantidade);

  if (!produto) {
    throw new Error('Produto não encontrado.');
  }

  if (!Number.isInteger(quantidadeNumerica) || quantidadeNumerica <= 0) {
    throw new Error('A quantidade deve ser um número inteiro maior que zero.');
  }

  if (tipoNormalizado === 'entrada') {
    produto.estoque += quantidadeNumerica;
  } else if (tipoNormalizado === 'saida') {
    if (quantidadeNumerica > produto.estoque) {
      throw new Error('Estoque insuficiente para realizar a saída.');
    }

    produto.estoque -= quantidadeNumerica;
  } else {
    throw new Error('Tipo inválido. Use entrada ou saida.');
  }

  const movimentacao: Movimentacao = {
    id: movimentacoes.length + 1,
    codigoProduto: produto.codigoProduto,
    tipo: tipoNormalizado,
    descricao,
    quantidade: quantidadeNumerica
  };

  movimentacoes.push(movimentacao);
  return { movimentacao, produto };
}

function mostrarResultado(resultado: { movimentacao: Movimentacao; produto: Produto }): void {
  const { movimentacao, produto } = resultado;

  console.log(`\nMovimentação ${movimentacao.id} registrada.`);
  console.log(`Produto: ${produto.descricaoProduto}`);
  console.log(`Descrição: ${movimentacao.descricao}`);
  console.log(`Estoque final: ${produto.estoque}`);
}

async function iniciarModoInterativo(): Promise<void> {
  const rl = createInterface({ input, output });

  try {
    console.log('Produtos disponíveis:');
    for (const produto of estoque) {
      console.log(`${produto.codigoProduto} - ${produto.descricaoProduto} (${produto.estoque} unidades)`);
    }

    const codigo = await rl.question('\nCódigo do produto: ');
    const tipo = await rl.question('Tipo (entrada/saida): ');
    const quantidade = await rl.question('Quantidade: ');
    const descricao = await rl.question('Descrição da movimentação: ');

    mostrarResultado(registrarMovimentacao(codigo, tipo, quantidade, descricao));
  } finally {
    rl.close();
  }
}

async function main(): Promise<void> {
  const [codigo, tipo, quantidade, ...descricao] = process.argv.slice(2);

  if (codigo && tipo && quantidade && descricao.length > 0) {
    mostrarResultado(registrarMovimentacao(codigo, tipo, quantidade, descricao.join(' ')));
  } else if (process.argv.length > 2) {
    throw new Error('Uso: npm run estoque -- <codigo> <entrada|saida> <quantidade> <descricao>');
  } else {
    await iniciarModoInterativo();
  }
}

main().catch((erro: unknown) => {
  const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido.';
  console.error(`Erro: ${mensagem}`);
  process.exitCode = 1;
});
