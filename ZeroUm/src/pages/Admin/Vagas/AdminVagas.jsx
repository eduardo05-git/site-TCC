import React, { useState } from 'react';
import './AdminVagas.css';

// Using mock pending vacancies for demonstration
const mockVagasPendentes = [
  {
    id: 1,
    titulo: "Desenvolvedor Backend Junior",
    empresa: "TechFlow",
    descricao: "Desenvolvimento de APIs REST com Node.js e Express.",
    requisitos: "Node.js, SQL, Git",
    dataEnvio: "2024-03-15",
    status: "Pendente"
  },
  {
    id: 2,
    titulo: "Designer UX/UI",
    empresa: "Creative Digital",
    descricao: "Criação de interfaces para web e mobile no Figma.",
    requisitos: "Figma, Portfólio, Conhecimento em testes de usabilidade",
    dataEnvio: "2024-03-16",
    status: "Pendente"
  },
  {
    id: 3,
    titulo: "Analista de Dados Pleno",
    empresa: "DataCorp",
    descricao: "Extração, transformação e carga de dados. Criação de dashboards.",
    requisitos: "Python, SQL, Power BI",
    dataEnvio: "2024-03-17",
    status: "Pendente"
  }
];

function AdminVagas() {
  const [vagas, setVagas] = useState(mockVagasPendentes);

  const handleAprovar = (id) => {
    // In a real app, this would make an API call to publish the vacancy
    if (window.confirm(`Tem certeza que deseja APROVAR a vaga ID ${id}? Ela ficará pública para os alunos.`)) {
      alert('Vaga aprovada e publicada com sucesso!');
      setVagas(vagas.filter(vaga => vaga.id !== id));
    }
  };

  const handleRejeitar = (id) => {
    // In a real app, this would make an API call to delete or mark the vacancy as rejected
    if (window.confirm(`Tem certeza que deseja REJEITAR a vaga ID ${id}? Ela será removida.`)) {
      alert('Vaga rejeitada e removida com sucesso!');
      setVagas(vagas.filter(vaga => vaga.id !== id));
    }
  };

  return (
    <div className="admin-vagas-container">
      <h2>Gerenciamento de Vagas Pendentes</h2>
      <p className="vagas-count">Total de vagas aguardando aprovação: {vagas.length}</p>
      
      <div className="vagas-table-wrapper">
        <table className="vagas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título da Vaga</th>
              <th>Empresa</th>
              <th>Data de Envio</th>
              <th>Requisitos Resumidos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vagas.length === 0 ? (
              <tr>
                <td colSpan="6" style={{textAlign: 'center', padding: '30px'}}>
                  Nenhuma vaga pendente no momento. Excelente trabalho! 🎉
                </td>
              </tr>
            ) : (
              vagas.map(vaga => (
                <tr key={vaga.id}>
                  <td>{vaga.id}</td>
                  <td><strong>{vaga.titulo}</strong></td>
                  <td>{vaga.empresa}</td>
                  <td>{vaga.dataEnvio}</td>
                  <td className="text-truncate" title={vaga.requisitos}>
                    {vaga.requisitos.length > 50 ? `${vaga.requisitos.substring(0, 50)}...` : vaga.requisitos}
                  </td>
                  <td className="action-buttons">
                    <button className="approve-btn" onClick={() => handleAprovar(vaga.id)}>
                      ✔️ Aprovar
                    </button>
                    <button className="reject-btn" onClick={() => handleRejeitar(vaga.id)}>
                      ❌ Rejeitar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminVagas;
