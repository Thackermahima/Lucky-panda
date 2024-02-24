import React from 'react';
import './Index.css';
import { Link } from 'react-router-dom';
export default function Landing1() {
    return (
        <div className="hero-section hero vh-100 d-flex align-items-center">
          <div className="container position-relative">
            <div className="coin big-coin"></div>
            <div className="coin medium-coin"></div>
            <div className="coin small-coin-above"></div>
    
            <div className="row">
              <div className="col-lg-6 my-auto">
                <h1 className="display-4">Discover the Magic of NFTs</h1>
                <p className="lead">Join the Lucky Panda community and uncover treasures beyond imagination.</p>

                <Link to="/NFT-collections" className="nav-link">
                <button className="btn btn-primary btn-lg">Explore Now</button>
                </Link>
                
              </div>
              <div className="col-lg-6 d-none d-lg-block">
                <div className="imageContainer">
                  <img src="/Luckypanda2-fotor-bg-remover-20240215182657.png" alt="Lucky Panda" className="img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}
