import React from "react";
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

const CreateLottery = () => {
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


          <form>
          <InputLabel htmlFor="name">Name</InputLabel>
            <FormControl fullWidth margin="normal" variant="outlined">
              <TextField
                id="name"
                fullWidth
                size="small"
                variant="outlined"
                type="text"
                placeholder="Enter your lottery colletion name"
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
              />
            </FormControl>
            <InputLabel htmlFor="resultTime">Result Time</InputLabel>
            <FormControl fullWidth margin="normal" variant="outlined">
              <Select
                // label="Result Time"
                id="resultTime"
                defaultValue={10}
              >
                <MenuItem value={5}>5 minutes</MenuItem>
                <MenuItem value={10}>10 minutes</MenuItem>
                <MenuItem value={15}>15 minutes</MenuItem>
              </Select>
            </FormControl>

            <Button type="submit" variant="contained" sx={{ backgroundColor: "#D82148", textTransform: 'capitalize', border: '2px solid #D82148', fontWeight: 'bold', marginTop: '25px', margin: 'auto',  // Center horizontally
    display: 'block'}}>
              Create Collection
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateLottery;
