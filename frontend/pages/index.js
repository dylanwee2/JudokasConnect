import Head from "next/head";
import styles from "../styles/Home.module.css";

function Home() {
  // Set an initializing state whilst Firebase connects
  return (
    <main className={styles.main}>
      {/* <h1 className={styles.title}>Welcome to index</h1> */}
      <div
        className="relative w-full h-160 bg-cover bg-auto bg-center"
        style={{ backgroundImage: "url('/homepage_bg_2.jpg')" }}
      >
        <div className="pl-20 pt-20">
          <h1 className="text-white text-base sm:text-6xl md:text-6xl lg:text-8xl xl:text-8xl font-sans ">Connecting</h1>
          <h1 className="text-white text-base sm:text-6xl md:text-6xl lg:text-8xl xl:text-8xl font-sans ">Judokas</h1>
        </div>

        <div className="flex block">
          <button className="
          sm:h-10 sm:w-32
          md:h-10 md:w-32
          lg:h-12 lg:w-40
          xl:h-12 xl:w-40 
          
          bg-orange-400 rounded-xl ml-20 mt-5 flex items-center justify-center
          text-black font-semibold
          hover:text-white hover:bg-orange-500
          text-center sm:text-lg md:text-lg lg:text-2xl xl:text-2xl">
          <a href='/signup'>Sign up</a>
          </button>

          <button className="
          sm:h-10 sm:w-32
          md:h-10 md:w-32
          lg:h-12 lg:w-40
          xl:h-12 xl:w-40 
          
          bg-orange-400 rounded-xl ml-5 mt-5 flex items-center justify-center
          text-black font-semibold
          hover:text-white hover:bg-orange-500
          text-center sm:text-lg md:text-lg lg:text-2xl xl:text-2xl">
            <a href='/login'>Login</a>
          </button>
        </div>
      </div>

      <div className="ml-20 mt-10 mr-20">
        <h1 className="text-4xl font-semibold">Latest News</h1>
        <div className=" py-5 grid gap-20 grid-cols-1 md:grid-cols-3">
          {[
            {
              title: "New Judo Rules Announced",
              desc: "The International Judo Federation has introduced...",
              img: "/judo_img_1.jpeg",
            },
            {
              title: "Championship Results and Highlights",
              desc: "The latest judo championship concluded with...",
              img: "/judo_img_2.jpeg",
            },
            {
              title: "Training Tips for Judokas",
              desc: "Improving your judo techniques requires dedication a...",
              img: "/judo_img_3.jpeg",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow"
            >
              <img
                src={item.img}
                alt={item.title}
                className="rounded-lg h-100 w-full object-cover mb-4"
              />
              <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
      
    </main>
  
  );
}

export default Home;