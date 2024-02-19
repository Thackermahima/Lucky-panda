import React from 'react';
import './Index.css'; // Make sure to create this CSS file and include your styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faDiscord, faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="lucky-panda-footer py-4 bg-dark text-white">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-3 mb-lg-0">
            <h4 className="mb-3">Lucky Panda</h4>
            <p className="small">Your gateway to exciting NFT-based lotteries with fair and secure draws.</p>
          </div>

          <div className="col-lg-4 mb-3 mb-lg-0">
            <h4 className="mb-3">Quick Links</h4>
            <ul className="list-unstyled">
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/support">Customer Support</a></li>
            </ul>
          </div>

          <div className="col-lg-4">
            <h4 className="mb-3">Follow Us</h4>
            <FontAwesomeIcon icon={faXTwitter} className="social-icon" />
            <FontAwesomeIcon icon={faDiscord}  className="social-icon"/>
            <FontAwesomeIcon icon={faInstagram}  className="social-icon"/>
            <FontAwesomeIcon icon={faFacebookF} className="social-icon" />

          </div>
        </div>

        <div className="text-center py-4 border-top mt-4">
          <p className="small mb-0">&copy; {new Date().getFullYear()} Lucky Panda. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
