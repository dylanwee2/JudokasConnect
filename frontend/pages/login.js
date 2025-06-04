import Head from "next/head";
import styles from "../styles/Home.module.css";

function Login() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to login</h1>
      </main>
    </div>
  );
}

export default Login;
