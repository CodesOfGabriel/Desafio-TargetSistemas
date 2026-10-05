function criarDataLocal(texto: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    throw new Error('Use a data no formato AAAA-MM-DD.');
  }

  const [ano, mes, dia] = texto.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia);

  if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
    throw new Error('Data de vencimento inválida.');
  }

  return data;
}

function calcularJuros(valor: number, vencimento: Date, hoje: Date = new Date()): {
  diasAtraso: number;
  juros: number;
} {
  if (!Number.isFinite(valor) || valor < 0) {
    throw new Error('Informe um valor válido.');
  }

  hoje.setHours(0, 0, 0, 0);
  vencimento.setHours(0, 0, 0, 0);

  if (hoje <= vencimento) {
    return { diasAtraso: 0, juros: 0 };
  }

  const diasAtraso = Math.round((hoje.getTime() - vencimento.getTime()) / 86_400_000);
  const juros = valor * 0.025 * diasAtraso;

  return { diasAtraso, juros };
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

const [valorInformado, vencimentoInformado] = process.argv.slice(2);

try {
  if (!valorInformado || !vencimentoInformado) {
    throw new Error('Uso: npm run juros -- <valor> <vencimento AAAA-MM-DD>');
  }

  const valor = Number(valorInformado.replace(',', '.'));
  const vencimento = criarDataLocal(vencimentoInformado);
  const { diasAtraso, juros } = calcularJuros(valor, vencimento);

  console.log(`Dias em atraso: ${diasAtraso}`);
  console.log(`Juros: ${formatarMoeda(juros)}`);
  console.log(`Valor total: ${formatarMoeda(valor + juros)}`);
} catch (erro: unknown) {
  const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido.';
  console.error(`Erro: ${mensagem}`);
  process.exitCode = 1;
}
