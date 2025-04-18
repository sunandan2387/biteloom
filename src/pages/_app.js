import Header from "@/components/header/Header";

import "@/styles/globals.css";
import { Inter, Roboto } from "next/font/google";
import { ThemeProvider } from "@/components/styles/ThemeProvider";
// import { SideNav } from "@/components/sidebar/SideNav2";
import { Footer } from "@/components/footer/Footer";
import { AuthProvider } from "@/context/SessionProvider";
import { ToastContainer } from "react-toastify";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
});

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className={`${roboto.variable} ${inter.variable}`}>
          <ToastContainer />
          <Header />
          <div className="flex w-full pt-12 bg-white">
            {/* <SideNav /> */}
            <Component {...pageProps} />
          </div>
          <Footer />
      </div>
    </AuthProvider>
  );
}
