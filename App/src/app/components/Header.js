import React, { useEffect, useState, useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { Web3Context } from "./context/Web3Context";

const Header = () => {
    const { address, connectWallet, disconnectWallet, shortAddress } = useContext(Web3Context);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleDisconnect = () => {
      disconnectWallet();
      handleClose();
    };

    return(
        <AppBar color="inherit" position="fixed" sx={{ height: "70px" }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>
          <Link to = {'/'}>
            <img src="" alt="logo" />
            </Link>
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Link to={'/create-lottery'}>
            <div>
        <Button style={{color:'black', fontWeight:'bold' ,textTransform:'capitalize'}} size='medium' variant='text'>Create Lottery</Button>
        </div>

        </Link>
        <Link to={'/lucky-draw-collections'}>

        <Button style={{color:'black', fontWeight:'bold' ,textTransform:'capitalize'}} size='medium' variant='text'>Lucky Draw Collection</Button>
       </Link>
 {address ? (
            <div>
              <Button
                variant="contained"
                size='medium'
                style={{ backgroundColor: "#D82148", textTransform: 'capitalize', border: '2px solid #D82148', marginRight: '18px', fontWeight: 'bold' }}
                sx={{ borderRadius: 2 }}
                onClick={handleClick}
              >
                {shortAddress(address)}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleDisconnect}>Disconnect</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button
              variant="contained"
              size='medium'
              style={{ backgroundColor: "#D82148", textTransform: 'capitalize', border: '2px solid #D82148', marginRight: '18px', fontWeight: 'bold' }}
              sx={{ borderRadius: 2 }}
              onClick={connectWallet}
            >
              Connect
            </Button>
          )}
       </div>
        </Toolbar>  
        </AppBar> 
    )
}
export default Header;