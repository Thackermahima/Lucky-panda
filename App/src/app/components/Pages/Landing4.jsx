import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './Index.css';

export default function Landing4() {
    const winners = [
        {
          id: 1,
          name: 'Alice',
          image: 'Winner.webp', // Path to the winner's image
          prize: '500 Matic',
          date: '2023-12-01'
        },
        {
          id: 2,
          name: 'Bob',
          image: 'Winner.webp',
          prize: '300 Matic',
          date: '2023-11-01'
        },
        // ... more winners
      ];
      const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000
      };

    return ( 
        <>
      <section className="winners-section py-5 mb-12">
      <div className="container">
        <h2 className="text-center mb-4">Past Winners</h2>
        <div className='under-line'></div>

        <Slider {...settings}>
          {winners.map(winner => (
            <div key={winner.id} className="px-2">
              <div className="card mx-auto" style={{ width: '100%' }}>
                <img src={winner.image} className="card-img-top" alt={`${winner.name}`} />
                <div className="card-body">
                  <h5 className="card-title">{winner.name}</h5>
                  <p className="card-text">Prize: {winner.prize}</p>
                  <p className="card-text">Date: {winner.date}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
        
        </>
    )
}