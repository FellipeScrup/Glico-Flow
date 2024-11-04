import Image from "next/image";
import styles from "./signup.module.css";
import Link from "next/link";
import logo from "@/assets/glicoflow-logo.png";

export default function signup() {
    return(
        <div className={styles.page}>
            <div className={styles.firstContainer}>
                <div className={styles.firstContainerImg}>
                    <Image src={logo} alt="GlicoFlow Logo" />
                </div>
                <div className={styles.firstContainerText}>
                    <h1>Por favor, insira seu email e senha para criar uma conta</h1>
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
                        <label htmlFor="termos">Eu li e aceito os <span>termos de privacidade</span></label>
                    </div>
                    <div className={styles.checkboxGroup}>
                        <input type="checkbox" id="newsletter" />
                        <label htmlFor="newsletter">Opicional: Desejo receber novidades e promoções por email</label>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.criarContaButton}>Criar conta</button>
                </div>
            </div>
        </div>
    );


}

