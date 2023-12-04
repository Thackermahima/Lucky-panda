"use client"; // This is a client component 👈🏽

import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes,Route,BrowserRouter}from "react-router-dom";
import CreateLottery from "./components/CreateLottery";
import LandingPage from "./components/LandingPage";
import LuckyDrawCollection from "./components/LuckyDrawCollection";
import { Web3ContextProvider } from "./components/context/Web3Context";
export default function Home() {
  
  return (
    <div>
    <BrowserRouter>
<Web3ContextProvider>

<Header />
{/* <LandingPage /> */}

<Routes>
<Route path="/" element={<LandingPage /> } />
<Route path="/create-lottery" element={<CreateLottery />} />
<Route path="/lucky-draw-collections" element={<LuckyDrawCollection />} />

</Routes>
<Footer />
</Web3ContextProvider>
</BrowserRouter>

    </div>
  )
}
