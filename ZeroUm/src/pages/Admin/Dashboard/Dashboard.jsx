import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h1>Painel de Controle Administrador</h1>
        <p>Visão geral do sistema e ferramentas de gerenciamento</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon users-icon">👥</div>
          <div className="stat-info">
            <h3>Usuários Registrados</h3>
            <p className="stat-number">Ver Lista</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon jobs-icon">💼</div>
          <div className="stat-info">
            <h3>Vagas Pendentes</h3>
            <p className="stat-number">Aguardando Avaliação</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/admin/usuarios" className="action-card">
          <h3>👤 Gerenciar Usuários</h3>
          <p>Vizualize, edite e exclua usuários cadastrados na plataforma.</p>
          <span className="action-link">Acessar &rarr;</span>
        </Link>
        
        <Link to="/admin/vagas" className="action-card">
          <h3>📋 Gerenciar Vagas</h3>
          <p>Revise as vagas enviadas pelas empresas antes de publicá-las.</p>
          <span className="action-link">Acessar &rarr;</span>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
