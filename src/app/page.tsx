

'use client';

import api from "@/services/api";
import { registerUser } from '@/services/userService';

export default function Home() {
  
  const handleTestCadastro = async () => {
    try {
      console.log('A enviar pedido para o backend...');
      
      
      const resposta = await registerUser({
        username: 'outro3_teste',
        nome: 'outro2 Mendes',
        email: 'outro2.teste@email.com',
        senhaHash: '123456789'
      });
      
      console.log('Sucesso! Resposta do backend:', resposta);
      alert('Utilizador cadastrado com sucesso! Veja o console.');
      
    } catch (error) {
      console.error('Erro ao testar o cadastro:', error);
      alert('Erro ao cadastrar. Verifique o console do navegador.');
    }
  };

  const handleTestLogin = async () => {

    const credenciais = {
    email: "giulia.ferreira@email.com", 
    senhaHash: "123456789"
  };

  try {
    const response = await api.post('/auth/login', credenciais);
    
    console.log("Sucesso! Aqui está o Token JWT:", response.data);
    alert("Login efetuado com sucesso!");
  } catch (error: any) {
    console.error("Erro ao fazer login:", error.response?.data || error);
    alert("Erro no login.");
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


      <button 
      onClick={handleTestLogin} 
      style={{ padding: '10px 20px', backgroundColor: '#10b981', color: '#fff', marginTop: '20px', borderRadius: '5px' }}
    >
    Testar Login de Utilizador
      </button>

    </div>
    


    
  );
}