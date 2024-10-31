import Image from "next/image";
import styles from "./page.module.css";
import logo from "@/assets/glicoflow-logo.png";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.logoContainer}>
          <Image
            src={logo}
            alt="GlicoFlow Logo"
            width={180}
            height={180}
            priority
            className={styles.logo}
          />
        </div>
        
        <h1 className={styles.title}>
          CONTROLE A SUA DIABETE
        </h1>

        <div className={styles.welcomeText}>
          <h2>BEM VINDO AO GlicoFlow!</h2>
          <p>um APP para melhorar sua qualidade de vida</p>
        </div>

        <button className={styles.startButton}>
          COMECE AGORA
        </button>
      </main>
    </div>
  );
}
