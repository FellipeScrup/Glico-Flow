import { useState } from 'react';
import PrivacyTerms from './PrivacyTerms';
import styles from './PrivacyCheckbox.module.css';

export default function PrivacyCheckbox({ checked, onChange }) {
    const [showTerms, setShowTerms] = useState(false);

    return (
        <div className={styles.container}>
            <input 
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className={styles.checkbox}
                id="privacy-checkbox"
                name="acceptedTerms"
            />
            <label htmlFor="privacy-checkbox" className={styles.label}>
                Aceito os{' '}
                <span 
                    onClick={(e) => {
                        e.preventDefault();
                        setShowTerms(true);
                    }}
                    className={styles.termsLink}
                >
                    termos de privacidade
                </span>
            </label>

            <PrivacyTerms 
                isOpen={showTerms}
                onClose={() => setShowTerms(false)}
            />
        </div>
    );
} 