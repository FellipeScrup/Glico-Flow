import Image from "next/image";
import styles from "./login.module.css";
import logo from "@/assets/glicoflow-logo.png";

export default function Login() {
  return (
    <div className={styles.page}>
      <div className={styles.logoContainer}>
        <Image
          src={logo}
          alt="GlicoFlow Logo"
          width={270}
          height={250}
          priority
          className={styles.logo}
        />
      </div>
      
      <div className={styles.whiteSection}>
        <h1 className={styles.title}>
          CONTROLE A SUA DIABETE
        </h1>

        <div className={styles.buttonContainer}>
          <button className={styles.createAccountButton}>
            CRIAR CONTA
          </button>
          <button className={styles.loginButton}>
            ENTRAR
          </button>
        </div>
      </div>
    </div>
  );
} 