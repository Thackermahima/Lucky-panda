import React, { useContext} from "react";
import { LuckyPandaContext } from "../context/LuckyPandaContext";
import './Index.css';

export default function CreateLottery() {

    const luckyPandaContext = useContext(LuckyPandaContext);
    const {
      ImgArr,
      AllTokenURIs,
      name,
      nameEvent,
      symbol,
      symbolEvent,
      tokenPrice,
      tokenPriceEvent,
      tokenQuantity,
      tokenQuantityEvent,
      resultTime,
      tokenResultTimeEvent,
      uploadImg,
      tokenImgEvent,
      loading,
      onFormSubmit,
      tokenWinnerPercentageEvent,
      winnerPercentage,
      getCollection,
      AllFilesArr
    } = luckyPandaContext;

    return (
        <div className="d-flex justify-content-center align-items-center mb-16">
        <div className="card w-50 mt-5">
          <div className="card-body">
            <h5 className="card-title text-center mb-3">Create Lottery NFT Collection</h5>
            <div className='under-line1'></div>
            <form onSubmit={onFormSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter your lottery collection name"
                  value={name}
                  onChange={nameEvent}
                />
              </div>
  
              <div className="mb-3">
                <label htmlFor="symbol" className="form-label">Symbol</label>
                <input
                  type="text"
                  className="form-control"
                  id="symbol"
                  placeholder="Enter symbol"
                  value={symbol}
                  onChange={symbolEvent}
                />
              </div>
  
              <div className="mb-3">
                <label htmlFor="totalTokenSupply" className="form-label">Total Lottery tickets</label>
                <input
                  type="number"
                  className="form-control"
                  id="totalTokenSupply"
                  placeholder="Enter total lottery tickets"
                  value={tokenQuantity}
                  onChange={tokenQuantityEvent}
                />
              </div>
  
              <div className="mb-3">
                <label htmlFor="price" className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  placeholder="0.00"
                  step="0.01"
                  value={tokenPrice}
                  onChange={tokenPriceEvent}
                />
              </div>
  
              <div className="mb-3">
                <label htmlFor="image" className="form-label">Upload Image</label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  onChange={tokenImgEvent}
                />
              </div>
  
              <div className="mb-3">
                <label htmlFor="winnerPercentage" className="form-label">Winner Percentage</label>
                <select
                  className="form-select"
                  id="winnerPercentage"
                  value={winnerPercentage}
                  onChange={tokenWinnerPercentageEvent}
                >
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((percent) => (
                    <option key={percent} value={percent}>{percent}%</option>
                  ))}
                </select>
              </div>
  
              <div className="mb-3">
                <label htmlFor="resultTime" className="form-label">Result Time</label>
                <select
                  className="form-select"
                  id="resultTime"
                  value={resultTime}
                  onChange={tokenResultTimeEvent}
                >
                  {[1, 5, 10, 15].map((time) => (
                    <option key={time} value={time}>{time} minutes</option>
                  ))}
                </select>
              </div>
  
              <div className="gap-2  py-2 px-2 d-flex justify-content-center align-items-center">
                <button className="btn fw-bold btn-primary" type="submit" disabled={loading} >
                  {loading ? 'Creating...' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
}