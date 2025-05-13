export interface DiaPrevisao {
    dia: string;
    tempo: string;
    maxima: string;
    minima: string;
    iuv: string;
  }
  
  export interface Cidade {
    nome: string;
    uf: string;
    atualizacao: string;
    previsao: DiaPrevisao[];
  }
  
  export interface PrevisaoResponse {
    cidade: Cidade;
  }

  export interface ForecastCardProps {
    dia: string;
    tempo: string;
    maxima: string;
    minima: string;
  }
  