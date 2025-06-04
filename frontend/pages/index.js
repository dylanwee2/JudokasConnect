import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
};

export default function Home() {


  return (
    <div className={styles.container}>
      <h1 className="text-3xl font-bold underline">
      Hello world!
      </h1>
    </div>
  );
}