'use client';

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
          width={320}
          height={320}
          priority
          className={styles.logo}
        />
      </div>
      
      <div className={styles.whiteSection}>
        <h1 className={styles.title}>
          CONTROLE SUA DIABETES
        </h1>
        <Link href="/signup">
          <button className={styles.createAccountButton}>
            Criar Conta
          </button>
        </Link>
        <Link href="/signin">
          <button className={styles.loginButton}>
            Entrar
          </button>
        </Link>
      </div>
    </div>
  );
}
