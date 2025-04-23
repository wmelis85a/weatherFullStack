import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface Previsao {
  dia: string;
  tempo: string;
  maxima: string;
  minima: string;
  iuv: string;
}

interface ClimaResponse {
  cidade: {
    nome: string;
    uf: string;
    atualizacao: string;
    previsao: Previsao[];
  };
}

function App() {
  const [dados, setDados] = useState<ClimaResponse | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`${API_URL}`)
      .then((res) => setDados(res.data))
      .catch((err) => {
        console.error(err);
        setErro("Erro ao buscar dados climáticos.");
      });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Previsão do Tempo</h1>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {dados ? (
        <>
          <h2>{dados.cidade.nome} - {dados.cidade.uf}</h2>
          <p>Última atualização: {dados.cidade.atualizacao}</p>
          <table border={1} cellPadding={10}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Tempo</th>
                <th>Máx</th>
                <th>Mín</th>
                <th>IUV</th>
              </tr>
            </thead>
            <tbody>
              {dados.cidade.previsao.map((dia) => (
                <tr key={dia.dia}>
                  <td>{dia.dia}</td>
                  <td>{descricaoTempo(dia.tempo)}</td>
                  <td>{dia.maxima}°C</td>
                  <td>{dia.minima}°C</td>
                  <td>{dia.iuv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Carregando dados...</p>
      )}
    </div>
  );
}

// Tradução de códigos de tempo para legível (exemplo simples)
function descricaoTempo(codigo: string): string {
  const tabela: Record<string, string> = {
    pn: "Parcialmente Nublado",
    c: "Chuva",
    ec: "Encoberto com Chuva",
    n: "Nublado",
    // adicione outros códigos conforme necessário
  };
  return tabela[codigo] || codigo;
}

export default App;
