import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './UserList.css'; 

const API_BASE_URL = 'http://localhost:8080/api/v1/usuario'; 

function UserList() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null); 
    const [formData, setFormData] = useState({}); 

    
    const fetchUsers = () => {
        axios.get(API_BASE_URL)
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => console.error("Erro ao buscar usuários (CORS ou Servidor):", error));
    };

    useEffect(() => {
        fetchUsers();
    }, []); 

    
    const startEdit = (user) => {
        setEditingUser(user.id);
        
        setFormData({ 
            nome: user.nome, 
            email: user.email,
            nivelAcesso: user.nivelAcesso,
            statusUsuario: user.statusUsuario 
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = (id) => {
        axios.put(`${API_BASE_URL}/${id}`, formData)
            .then(() => {
                alert('Usuário atualizado com sucesso!');
                setEditingUser(null);
                fetchUsers(); 
            })
            .catch(error => console.error("Erro ao atualizar:", error));
    };
    
    
    const handleToggleStatus = (user) => {
        const novoStatus = user.statusUsuario === 'ATIVO' ? 'INATIVO' : 'ATIVO';
        const acao = novoStatus === 'INATIVO' ? 'desativar' : 'reativar';
        if (!window.confirm(`Tem certeza que deseja ${acao} o usuário ${user.nome}?`)) return;
        axios.put(`${API_BASE_URL}/${user.id}`, { statusUsuario: novoStatus })
            .then(() => fetchUsers())
            .catch(error => console.error("Erro ao atualizar status:", error));
    };


    
    return (
        <div className="user-list-container">
            <h2>Gerenciamento de Usuários </h2>
            <p className="user-count">Total de usuários: {users.length}</p>
            
            <div className="users-table-wrapper">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Nível</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr><td colSpan="6" style={{textAlign: 'center'}}>Nenhum usuário cadastrado.</td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    
                                    {editingUser === user.id ? (
                                       
                                        <>
                                            <td><input name="nome" type="text" value={formData.nome || ''} onChange={handleChange} /></td>
                                            <td><input name="email" type="text" value={formData.email || ''} onChange={handleChange} /></td>
                                            <td>
                                                <select name="nivelAcesso" value={formData.nivelAcesso || ''} onChange={handleChange}>
                                                    <option value="ESTUDANTE">Estudante</option>
                                                    <option value="EMPRESA">Empresa</option>
                                                    <option value="ADMIN">Administrador</option>
                                                </select>
                                            </td>
                                            <td>
                                                <select name="statusUsuario" value={formData.statusUsuario || ''} onChange={handleChange}>
                                                    <option value="ATIVO">Ativo</option>
                                                    <option value="INATIVO">Inativo</option>
                                                </select>
                                            </td>
                                            <td className="action-buttons">
                                                <button className="save-btn" onClick={() => handleUpdate(user.id)}>Salvar</button>
                                                <button className="cancel-btn" onClick={() => setEditingUser(null)}>Cancelar</button>
                                            </td>
                                        </>
                                    ) : (
                                        
                                        <>
                                            <td>{user.nome}</td>
                                            <td>{user.email}</td>
                                            <td>{user.nivelAcesso}</td>
                                            <td>{user.statusUsuario}</td>
                                            <td className="action-buttons">
                                                <button className="edit-btn" onClick={() => startEdit(user)}>Editar</button>
                                                <button className="delete-btn" onClick={() => handleToggleStatus(user)}>
                                                    {user.statusUsuario === 'ATIVO' ? 'Desativar' : 'Ativar'}
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserList;
