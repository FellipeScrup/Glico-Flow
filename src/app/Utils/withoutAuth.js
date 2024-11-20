// src/app/utils/withoutAuth.js

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withoutAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        useEffect(() => {
            if (token) {
                router.replace('/dashboard');
            }
        }, [token]);

        if (!token) {
            return <WrappedComponent {...props} />;
        } else {
            return null; // Ou exibir uma mensagem de erro, se preferir
        }
    };
    // Dentro do else no HOC `withoutAuth`:
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Erro</h1>
                <p>Você já está logado e não pode acessar esta página.</p>
                <button onClick={() => router.replace('/dashboard')}>Ir para o Dashboard</button>
        </div>
    );

};

export default withoutAuth;
