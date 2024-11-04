import Image from "next/image";
import styles from "./signin.module.css";
import Link from "next/link";
import logo from "@/assets/glicoflow-logo.png";

export default function signin() {
    return(
        
        <div className={styles.page}>
            <div className={styles.firstContainer}>
                <div className={styles.firstContainerImg}>
                    <Image src={logo} alt="GlicoFlow Logo" />
                </div>
                <div className={styles.firstContainerText}>
                    <h1>Bem vindo de volta!</h1>
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input type="email" id="email" placeholder="Seu email:" required />
                        <label htmlFor="email">Seu email:</label>
                    </div>
                    <div className={styles.inputGroup}>
                        <input type="password" id="senha" placeholder="Sua senha:" required />
                        <label htmlFor="senha">Sua senha:</label>
                    </div>
                </div>
                <div className={styles.box}>
                    <div className={styles.checkboxGroup}>
                        <input type="checkbox" id="termos" />
                        <label htmlFor="termos">Lembrar acesso</label>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.criarContaButton}>Entrar</button>
                </div>
            </div>
        </div>

    )
}
