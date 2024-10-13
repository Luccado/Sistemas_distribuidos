import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/message')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setMessage(data.message))
      .catch(error => {
        console.error('Erro ao buscar mensagem:', error);
        setMessage('Erro ao buscar mensagem');
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Aplicativo de Hello World</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
