import React from "react";
import { Card, CardContent, CardActions, Box, Button, Typography } from '@mui/material';
const LuckyDrawCollection = () => {
  
    return (
        <Box
       sx={{
        mt:'10%',
        mb:'5%'
       }}
        // height="100vh"
      >
         <Typography variant="h5" align="center" style={{ marginTop: '2rem' }}>
Explore Lottery Collections
</Typography>
        <Card sx={{ width:'20%'}}>
        <CardContent>
         
         <img src="" alt="nft img"/> 
         
        </CardContent>
        <br />
        <CardActions>
            <Typography>anyone's collection</Typography>
        </CardActions>
      </Card>
      </Box>
    );
  
  

}
export default LuckyDrawCollection