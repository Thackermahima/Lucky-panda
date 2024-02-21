"use client"; // This is a client component 👈🏽
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes,Route,BrowserRouter}from "react-router-dom";
import { Web3ContextProvider } from "./components/context/Web3Context";
import { LuckyPandaContextProvider } from "./components/context/LuckyPandaContext";
import Header from './components/Pages/Header';
import Footer from "./components/Pages/Footer";
import LandingPage from './components/Pages/LandingPage';
import CreateLottery from './components/Pages/CreateLottery';
import LuckyDrawCollection from './components/Pages/LuckyDrawCollections';
import AllCollections from './components/Pages/AllCollections';
import './globals.css';

export default function Home() {
  
  return (
    <div>
<BrowserRouter>
<Web3ContextProvider>
<LuckyPandaContextProvider>
  <Header />
 
  <Routes>
  <Route path="/" element={<LandingPage /> } />
  <Route path="/create-lottery" element={<CreateLottery />} />
  <Route path="/lucky-draw-collections" element={<LuckyDrawCollection />} />
  <Route path="/all-collections/:address" element={<AllCollections />} />

 
  </Routes>
  <Footer />
</LuckyPandaContextProvider>
</Web3ContextProvider>
</BrowserRouter>
    </div>
  )
}
