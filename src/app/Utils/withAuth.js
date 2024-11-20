// src/app/utils/withoutAuth.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const withoutAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
      if (token) {
        router.replace('/dashboard');
      }
    }, []);

    if (isAuthenticated === null) {
      return null; // Ou um indicador de carregamento
    }

    if (!isAuthenticated) {
      return <WrappedComponent {...props} />;
    } else {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Erro</h1>
          <p>Você não pode acessar esta página estando logado.</p>
        </div>
      );
    }
  };
};

export default withoutAuth;
