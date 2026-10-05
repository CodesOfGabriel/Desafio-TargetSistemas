import dadosVendas from './data/vendas.json';

type Venda = {
  vendedor: string;
  valor: number;
};

function calcularComissao(valor: number): number {
  if (valor < 100) {
    return 0;
  }

  if (valor < 500) {
    return valor * 0.01;
  }

  return valor * 0.05;
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

const comissoesPorVendedor: Record<string, number> = {};

for (const venda of dadosVendas.vendas as Venda[]) {
  if (!comissoesPorVendedor[venda.vendedor]) {
    comissoesPorVendedor[venda.vendedor] = 0;
  }

  comissoesPorVendedor[venda.vendedor] += calcularComissao(venda.valor);
}

console.log('Comissões por vendedor:\n');

for (const [vendedor, comissao] of Object.entries(comissoesPorVendedor)) {
  console.log(`${vendedor}: ${formatarMoeda(comissao)}`);
}
