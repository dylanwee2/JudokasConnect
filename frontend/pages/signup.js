import Head from "next/head";
import styles from "../styles/Home.module.css";
import SignupComponent  from "../components/signup";

function Signup() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Sign Up Now!</title>
      </Head>

      <SignupComponent></SignupComponent>
    </div>
  );
}

export default Signup;
