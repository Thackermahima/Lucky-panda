import React from "react";

export default function AllCollections() {

    return (
        <>
         <div className="container py-5">
        <div className="row row-cols-1 row-cols-md-3 g-4">
            <div className="col">
              <div className="card h-100">
                <img src='Winner.webp' className="card-img-top" width='230px' height='230px' />
                <div className="card-body">
                               <button type="button" className="btn fw-bold btn-outline-primary" >
                                Buy for
                </button>
                </div>
              </div>
            </div>
        </div>
      </div>
        </>
    )
}