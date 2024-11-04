'use client'
import Image from "next/image";
import styles from "./diabetes-type.module.css";
import { useRouter } from "next/navigation";
import logo from "@/assets/glicoflow-logo.png";

export default function DiabetesType() {
    const router = useRouter();

    const diabetesTypes = [
        { id: 'tipo1', label: 'TIPO 1' },
        { id: 'tipo2', label: 'TIPO 2' },
        { id: 'pre', label: 'PRÉ DIABETES' },
        { id: 'gestacional', label: 'GESTACIONAL' }
    ];

    const handleSelection = (type) => {
        // Aqui você pode salvar o tipo de diabetes selecionado
        console.log('Tipo selecionado:', type);
        
        // Aqui você pode adicionar a lógica para salvar todas as informações coletadas
        // Por exemplo, combinar com os dados do cadastro e dados pessoais
        
        // Redirecionar para a próxima página (dashboard ou outra tela)
        router.push('/dashboard'); // Ajuste o caminho conforme necessário
    };

    return (
        <div className={styles.page}>
            <div className={styles.firstContainer}>
                <div className={styles.firstContainerImg}>
                    <Image src={logo} alt="GlicoFlow Logo" />
                </div>
                <div className={styles.firstContainerText}>
                    <h1>Qual é o seu tipo de DIABETE?</h1>
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.optionsContainer}>
                    {diabetesTypes.map((type) => (
                        <button
                            key={type.id}
                            className={styles.optionButton}
                            onClick={() => handleSelection(type.id)}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
} 