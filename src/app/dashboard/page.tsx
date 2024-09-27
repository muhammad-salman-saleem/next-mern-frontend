"use client";

import { useEffect, useState, ChangeEvent } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Dashboard() {
  const [carModel, setCarModel] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [city, setCity] = useState<string>("Lahore");
  const [maxPictures, setMaxPictures] = useState<number>(1);
  const [pictures, setPictures] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (pictures.length + files.length > maxPictures) {
      toast.error(`You can only upload up to ${maxPictures} pictures.`)
      return;
    }

    setPictures((prevPictures) => [...prevPictures, ...files]);
    setPreviewUrls((prevUrls) => [
      ...prevUrls,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData();
    formData.append("carModel", carModel);
    formData.append("price", price);
    formData.append("phone", phone);
    formData.append("city", city);
    formData.append("maxPictures", maxPictures.toString());

    pictures.forEach((picture) => {
      formData.append(`pictures`, picture);
    });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/car`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (res.ok) {
        toast.success('Vehicle information submitted successfully')
        router.push("/dashboard");
        setCarModel("");
        setPrice("");
        setPhone("");
        setCity("");
        setMaxPictures(1);
        setPreviewUrls([]);
        setPictures([]);
        setLoading(false)
      } else {
        toast.error('All fields are required')
        setLoading(false)
      }
    } catch (error) {
      console.error(error);
      toast.error('Error submitting the form.')
      setLoading(false)
    }
  };

  const handleAddPictureClick = () => {
    document.getElementById("file-input")?.click();
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{display:"flex",alignItems:"center",flexWrap:{xs:"wrap",sm:"nowrap"}}}>
              <Typography sx={{minWidth:"150px"}}>Car Model</Typography>
            <TextField
              fullWidth
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              required
              inputProps={{ minLength: 3 }}
            />
          </Grid>
          <Grid item xs={12} sx={{display:"flex",alignItems:"center",flexWrap:{xs:"wrap",sm:"nowrap"}}}>
          <Typography sx={{minWidth:"150px"}}>Price</Typography>
            <TextField
              fullWidth
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sx={{display:"flex",alignItems:"center",flexWrap:{xs:"wrap",sm:"nowrap"}}}>
          <Typography sx={{minWidth:"150px"}}>Phone Number</Typography>
            <TextField
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              inputProps={{ maxLength: 11 }}
            />
          </Grid>
          <Grid item tem xs={12} sx={{display:"flex",alignItems:"center",flexWrap:{xs:"wrap",sm:"nowrap"}}}>
            <Typography sx={{minWidth:"150px"}}>City</Typography>
            <FormControl component="fieldset" >
              <RadioGroup
                row
                aria-label="city"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <FormControlLabel
                  value="Lahore"
                  control={<Radio />}
                  label="Lahore"
                />
                <FormControlLabel
                  value="Karachi"
                  control={<Radio />}
                  label="Karachi"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Dropdown for Max Pictures */}
          <Grid item xs={12} md={6} lg={4} sx={{display:"flex",alignItems:"center",flexWrap:{xs:"wrap",sm:"nowrap"}}}>
          <Typography sx={{minWidth:"150px"}}> No of copies</Typography>
            <Select
              fullWidth
              value={maxPictures}
              onChange={(e) => setMaxPictures(Number(e.target.value))}
              required
              displayEmpty
            >
              <MenuItem value="" disabled>
                No of pictures
              </MenuItem>
              {[...Array(10).keys()].map((num) => (
                <MenuItem key={num + 1} value={num + 1}>
                  {num + 1}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Preview of Selected Images */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {previewUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Preview ${index}`}
                  width={100}
                  height={100}
                />
              ))}
              <Box>
                <input
                  accept="image/*"
                  type="file"
                  multiple
                  onChange={handlePictureChange}
                  hidden
                  id="file-input"
                />
                <Box
                  width={100}
                  height={100}
                  sx={{
                    border: "1px solid",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    marginBottom: 2,
                  }}
                  onClick={handleAddPictureClick}
                >
                  + add picture
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="inherit"
              type="submit"
              sx={{ width: "100%",minHeight:"60px" }}
            >
              {loading?<CircularProgress color="primary"/>:"Add Car"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
