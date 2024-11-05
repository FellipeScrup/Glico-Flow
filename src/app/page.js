'use client'
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import logo from "@/assets/glicoflow-logo.png";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.logoContainer}>
        <Image
          src={logo}
          alt="GlicoFlow Logo"
          width={320}
          height={320}
          priority
          className={styles.logo}
        />
      </div>
      
      <div className={styles.content}>
        <h1 className={styles.title}>
          CONTROLE A SUA DIABETES
        </h1>

        <div className={styles.welcomeText}>
          <h2>BEM-VINDO AO <span className={styles.highlight}>GlicoFlow</span></h2>
          <p>Seu parceiro para uma vida mais saudável</p>
        </div>

        <Link href="/login">
          <button className={styles.startButton}>
            Comece Agora
          </button>
        </Link>
      </div>
    </div>
  );
}
