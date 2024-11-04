import Image from "next/image";
import Link from "next/link";
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
          <Link href="/signup">
            <button className={styles.createAccountButton}>
              CRIAR CONTA
            </button>
          </Link>
          <Link href="/signin">
            <button className={styles.loginButton}>
              ENTRAR
            </button>
          </Link>
        </div>
      </div>
    </div>
    
  );
} 