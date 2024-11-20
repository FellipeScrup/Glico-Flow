'use client';

import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button onClick={toggleTheme}>
            {isDark ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
        </button>
    );
} 