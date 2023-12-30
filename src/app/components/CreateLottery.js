import React, {useContext} from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { LuckyPandaContext } from "./context/LuckyPandaContext";
const CreateLottery = () => {

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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      // height="100vh"
    >
      <Card sx={{ width: '50%', mt:'10%'}}>
        <CardContent>
        <Typography variant="h5" align="center" style={{ marginTop: '2rem' }}>
  Create Lottery NFT Collection
</Typography>


          <form onSubmit={onFormSubmit}>
          <InputLabel htmlFor="name">Name</InputLabel>
            <FormControl fullWidth margin="normal" variant="outlined">
              <TextField
                id="name"
                fullWidth
                size="small"
                variant="outlined"
                type="text"
                placeholder="Enter your lottery colletion name"
                value={name}
                onChange={nameEvent}
              />
            </FormControl>
            <InputLabel htmlFor="symbol">Symbol</InputLabel>
            <FormControl fullWidth margin="normal" variant="outlined">
              <TextField
                id="symbol"
                fullWidth
                size="small"
                variant="outlined"
                type="text"
                placeholder="Enter symbol"
                value={symbol}
                onChange={symbolEvent}
              />
            </FormControl>
            <InputLabel htmlFor="totalTokenSupply">Total Token Supply</InputLabel>
            <FormControl fullWidth margin="normal" variant="outlined">
              <TextField
                id="totalTokenSupply"
                type="number"
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Enter token supply"
                value={tokenQuantity}
                onChange={tokenQuantityEvent}
              />
            </FormControl>
            <InputLabel htmlFor="price">Price</InputLabel>
            <FormControl fullWidth margin="normal" variant="outlined">
              <TextField
                id="price"
                type="number"
                fullWidth
                size="small"
                variant="outlined"
                placeholder="0.00"
                step="0.01"
                value={tokenPrice}
                onChange={tokenPriceEvent}
/>
            </FormControl>
            <InputLabel htmlFor="image">Upload Image</InputLabel>
            <FormControl fullWidth margin="normal" variant="outlined">
              <TextField
                id="image"
                fullWidth
                size="small"
                type="file"
                variant="outlined"
                onChange={tokenImgEvent}
              />
            </FormControl>
            {/* <InputLabel htmlFor="resultTime">Winner Price</InputLabel>
            <FormControl fullWidth margin="normal" variant="outlined">
              <Select
                // label="Result Time"
                id="winnerPercentage"
                value={winnerPercentage}
                onChange={tokenWinnerPercentageEvent}
              >
                <MenuItem value={10}>10%</MenuItem>
                <MenuItem value={20}>20%</MenuItem>
                <MenuItem value={30}>30%</MenuItem>
                <MenuItem value={40}>40%</MenuItem>
                <MenuItem value={50}>50%</MenuItem>
                <MenuItem value={60}>60%</MenuItem>
                <MenuItem value={70}>70%</MenuItem>
                <MenuItem value={80}>80%</MenuItem>
                <MenuItem value={90}>90%</MenuItem>
                <MenuItem value={100}>100%</MenuItem>
              </Select>
            </FormControl>
            <InputLabel htmlFor="resultTime">Result Time</InputLabel>
            <FormControl fullWidth margin="normal" variant="outlined">
              <Select
                // label="Result Time"
                id="resultTime"
                value={resultTime}
                onChange={tokenResultTimeEvent}
              >
                <MenuItem value={1}>1 minutes</MenuItem>
                <MenuItem value={5}>5 minutes</MenuItem>
                <MenuItem value={10}>10 minutes</MenuItem>
                <MenuItem value={15}>15 minutes</MenuItem>
              </Select>
            </FormControl> */}

            <Button type="submit" variant="contained" sx={{ backgroundColor: "#D82148", textTransform: 'capitalize', border: '2px solid #D82148', fontWeight: 'bold', marginTop: '25px', margin: 'auto',  // Center horizontally
    display: 'block'}}
    >
              Create Collection
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateLottery;
