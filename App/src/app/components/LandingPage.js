import React from "react";
import { Button } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
const LandingPage = () => {

    return (
        <div>
<div style={{ width: '100%', height: '100vh',  margin: 0, padding: 0 }}>

   <img src="giphy.gif" width="100%" height="100%"  className="giphy"  style={{filter: 'blur(2px)'}}/>
   <Tooltip title="Buy lottery from here!">

   <Button
    style={{
      position: 'absolute',
      right: '20%',
      top : '38%',
      transform: 'translateX(-50%)',
      fontWeight: 'bold',
      textTransform: 'capitalize',
      // backgroundColor:"#D82148",
      color: 'black',
      fontSize:'22px',
      zIndex: 1
    }}
 size='large' variant="text">Me🙋🏻🤑</Button>
 </Tooltip>
 <img src="bubble.png" width="19%" height="22%" style={{  position: 'absolute',
      right: '11%',
      top : '33%',
      transform: 'translateX(-50%)'}}/>
</div>
  </div>
    )
}
export default LandingPage;