// "use client"; // This is a client component 👈🏽

// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import { Routes,Route,BrowserRouter}from "react-router-dom";
// import CreateLottery from "./components/CreateLottery";
// import LandingPage from "./components/LandingPage";
// import LuckyDrawCollection from "./components/LuckyDrawCollection";
// import { Web3ContextProvider } from "./components/context/Web3Context";
// import { LuckyPandaContextProvider } from "./components/context/LuckyPandaContext";
// export default function Home() {
  
//   return (
//     <div>
//     <BrowserRouter>
// <Web3ContextProvider>
// <LuckyPandaContextProvider>

// <Header />
// {/* <LandingPage /> */}
// <Routes>
// <Route path="/" element={<LandingPage /> } />
// <Route path="/create-lottery" element={<CreateLottery />} />
// <Route path="/lucky-draw-collections" element={<LuckyDrawCollection />} />
// </Routes>
// <Footer />
// </LuckyPandaContextProvider>
// </Web3ContextProvider>
// </BrowserRouter>

//     </div>
//   )
// }
"use client"; // This is a client component 👈🏽
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes,Route,BrowserRouter}from "react-router-dom";
import { Web3ContextProvider } from "./components/context/Web3Context";
import { LuckyPandaContextProvider } from "./components/context/LuckyPandaContext";
import Landing1 from "./components/Pages/Landing1";
import Landing2 from './components/Pages/Landing2';
import Header from './components/Pages/Header';
import Footer from "./components/Pages/Footer";

import './globals.css';

export default function Home() {
  
  return (
    <div>
    <BrowserRouter>
<Web3ContextProvider>
<LuckyPandaContextProvider>
  <Header />
  <Landing1 />
  <Landing2 />
  <Footer />
</LuckyPandaContextProvider>
</Web3ContextProvider>
</BrowserRouter>

    </div>
  )
}
