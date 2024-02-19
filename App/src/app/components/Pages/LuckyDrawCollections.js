import React from "react";
import { Link } from "react-router-dom";

export default function LuckyDrawCollection() {
    return(
        <div className="container py-5">
        <h2 className="text-center mb-4">Explore Collections</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col">
              <div className="card h-100">
                <img src='Winner.webp' className="card-img-top" width='230px' height='230px' />
                <div className="card-body">
                <Link to="/all-collections" className="nav-link px-2">   
                               <h5 className="card-title">Alex's collection</h5>
                  </Link>
                </div>
              </div>
            </div>
        </div>
      </div>
    );
}