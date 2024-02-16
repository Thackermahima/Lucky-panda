import React from 'react';
import './About.css';

export default function Landing2() {
  return (
    <section id="about" className="py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5 mb-4 mb-lg-0">
          <div className="about-image">
            <img src="/about.webp" alt="About Lucky Panda" className="img-fluid" />
            </div>
          </div>
          <div className="col-lg-7">
            <h2 className="display-4 fw-bold lh-1 mb-3">Unlock the Thrill of NFTs with Lucky Panda: Your Gateway to Blockchain-based Wins</h2>
            <ul className="list-unstyled">
              <li className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2"></i>Innovative NFT platform</li>
              <li className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2"></i>Merge art with lotteries</li>
              <li className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2"></i>Unique NFTs with each purchase</li>
              <li className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2"></i>Regular lottery draws for NFT holders</li>
              <li className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2"></i>Transparent and fair with blockchain technology</li>
              <li className="mb-2"><i className="bi bi-check-circle-fill text-primary me-2"></i>Powered by Chainlink VRF</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
