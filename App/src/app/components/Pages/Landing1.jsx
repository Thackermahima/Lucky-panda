import React from "react";
import './Index.css';
export default function Landing1() {
    return (
        <>
            <div className="hero-section hero">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 my-auto">
                            <h1 className="display-4">Discover the Magic of NFTs</h1>
                            <p className="lead">Join the Lucky Panda community and uncover treasures beyond imagination.</p>
                            <button className="btn btn-primary btn-lg">Explore Now</button>
                        </div>
                        <div className="col-md-6">
                            <div className="imageContainer">
                                <img src="/Luckypanda2-fotor-bg-remover-20240215182657.png" alt="Lucky Panda" className="img-fluid animatedImage" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
