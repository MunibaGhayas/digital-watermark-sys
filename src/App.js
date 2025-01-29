import "./index.css";
import { Button, ToggleButtonGroup, ToggleButton } from "@mui/material";
import {
  TextField,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  styled,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { useState } from "react";
import { Greedy } from "./components/Greedy";
import { DivideAndConquer } from "./components/DivideAndConquer";
import { DP } from "./components/DynamicProgramming";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function App() {
  const [selectAlgorithm, setSelectAlgorithm] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [watermark, setWatermark] = useState("");
  const [watermarkedImage, setWatermarkedImage] = useState(null);
  const [isSingleWatermark, setIsSingleWatermark] = useState(true);

  const handleAlgorithmChange = (e) => {
    setSelectAlgorithm(e.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWatermark = (e) => {
    setWatermark(e.target.value);
  };

  const embedWatermark = (event, newValue) => {
    if (newValue !== null) {
      setIsSingleWatermark(newValue === "isSingle");
    }
  };

  const handleApplyWatermark = () => {
    if (uploadedImage && watermark && selectAlgorithm) {
      const algorithmMap = {
        Greedy: Greedy,
        DivideAndConquer: DivideAndConquer,
        DP: DP,
      };

      const selectedAlgorithm = algorithmMap[selectAlgorithm];
      if (selectedAlgorithm) {
        selectedAlgorithm(
          uploadedImage,
          watermark,
          setWatermarkedImage,
          isSingleWatermark
        );
      }
    } else {
      alert("Please upload an image and select an algorithm.");
    }
  };

  return (
    <div className="App">
      <h1 style={{ textAlign: "center" }}>Digital Watermarking System</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<UploadIcon />}
        >
          Upload Image
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileChange}
            multiple
          />
        </Button>
      </div>
      {uploadedImage && (
        <div
          style={{
            marginTop: "2rem",
            marginBottom: "1rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={uploadedImage}
            alt="Uploaded"
            style={{ maxWidth: "50%", maxHeight: "300px" }}
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "3rem",
          marginBottom: "2rem",
        }}
      >
        <TextField
          id="standard-basic"
          label="Watermark"
          variant="standard"
          value={watermark}
          onChange={handleWatermark}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">
            ALgorithm
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={selectAlgorithm}
            onChange={handleAlgorithmChange}
            label="Age"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="DivideAndConquer">Divide And Conquer</MenuItem>
            <MenuItem value="Greedy">Greedy</MenuItem>
            <MenuItem value="DP">DP</MenuItem>
          </Select>
        </FormControl>
        <ToggleButtonGroup
          color="primary"
          value={isSingleWatermark ? "isSingle" : "multiple"}
          exclusive
          onChange={embedWatermark}
          aria-label="WaterMark Type"
        >
          <ToggleButton value="isSingle">Single</ToggleButton>
          <ToggleButton value="multiple">Multiple</ToggleButton>
        </ToggleButtonGroup>
        <Button variant="text" onClick={handleApplyWatermark}>
          Embed Watermark
        </Button>
      </div>
      {watermarkedImage && (
        <div
          style={{
            marginTop: "1rem",
            marginBottom: "1rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={watermarkedImage}
            alt="watermarkImage"
            style={{ maxWidth: "50%", maxHeight: "300px" }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
