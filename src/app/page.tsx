

'use client';

import api from "@/services/api";
import { registerUser } from '@/services/userService';

export default function Home() {
  
  const handleTestCadastro = async () => {
    try {
      console.log('A enviar pedido para o backend...');
      
      
      const resposta = await registerUser({
        username: 'outro_teste',
        nome: 'outro Mendes',
        email: 'outro.teste@email.com',
        senhaHash: '123456789'
      });
      
      console.log('Sucesso! Resposta do backend:', resposta);
      alert('Utilizador cadastrado com sucesso! Veja o console.');
      
    } catch (error) {
      console.error('Erro ao testar o cadastro:', error);
      alert('Erro ao cadastrar. Verifique o console do navegador.');
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Teste de Integração</h1>
      <button 
        onClick={handleTestCadastro}
        style={{ padding: '10px 20px', cursor: 'pointer', fontSize: '16px' }}
      >
        Testar Cadastro de Utilizador
      </button>
    </div>
  );
}