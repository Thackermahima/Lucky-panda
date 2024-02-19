import React from 'react';
import './Index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
export default function Landing3() {
  return (
    <section className="how-it-works-section py-5">
      <div className="container">
      <div className="d-flex justify-content-center align-items-center">
  <h2 className="text-white fw-bold mb-4 py-2 px-16 rounded-5" style={{ backgroundColor: '#191970'}}> 
    How It Works
  </h2>
</div>        

<div className="row justify-content-center text-center">
          {/* Boxes in a single column */}
         
            {/* Box 1 */}

{/* Box 1 */}
<div className="col-auto mb-2">
  <div className="card step-card">
    <div className="card-body">
      <h5 className="fw-bold">Create Lottery</h5>
      <p className="card-text">Creators set up a Lottery NFT collection with details.</p>
    </div>
  </div>
</div>

{/* Arrow 1 */}
<div className="col-auto my-auto">
  <FontAwesomeIcon icon={faArrowRight} size="2x" />
</div>

{/* Box 1 */}
<div className="col-auto mb-2">
  <div className="card step-card">
    <div className="card-body">
      <h5 className="fw-bold">Create Lottery</h5>
      <p className="card-text">Creators set up a Lottery NFT collection with details.</p>
    </div>
  </div>
</div>

{/* Arrow 1 */}
<div className="col-auto my-auto">
  <FontAwesomeIcon icon={faArrowRight} size="2x" />
</div>



{/* Box 1 */}
<div className="col-auto mb-2">
  <div className="card step-card">
    <div className="card-body">
      <h5 className="fw-bold">Create Lottery</h5>
      <p className="card-text">Creators set up a Lottery NFT collection with details.</p>
    </div>
  </div>
</div>

{/* Arrow 1 */}
<div className="col-auto my-auto">
  <FontAwesomeIcon icon={faArrowRight} size="2x" />
</div>

              {/* Box 1 */}

{/* Box 1 */}
<div className="col-auto mb-2">
  <div className="card step-card">
    <div className="card-body">
      <h5 className="fw-bold">Create Lottery</h5>
      <p className="card-text">Creators set up a Lottery NFT collection with details.</p>
    </div>
  </div>
</div>

{/* Arrow 1 */}
<div className="col-auto my-auto">
  <FontAwesomeIcon icon={faArrowRight} size="2x" />
</div>



{/* Box 1 */}
<div className="col-auto mb-2">
  <div className="card step-card">
    <div className="card-body">
      <h5 className="fw-bold">Create Lottery</h5>
      <p className="card-text">Creators set up a Lottery NFT collection with details.</p>
    </div>
  </div>
</div>
              
</div>
</div>
    </section>
  );
};
