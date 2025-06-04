import "../styles/globals.css";
import NavBar from "../components/navbar";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <NavBar> </NavBar>
      <Component {...pageProps}> </Component>
    </div> 
  );
}

export default MyApp;
