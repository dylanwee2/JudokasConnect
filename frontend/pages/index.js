import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
};

function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Welcome to index</h1>
    </main>
  
  );
}

export default Home;