import Loupe from "../assets/loupe.svg";
import { CenterBox, MainBox } from "../components/Components";
import Typography from "@mui/material/Typography";

function Search() {
  return (
    <MainBox>
      <Typography
        variant="h4"
        component="div"
        sx={{
          flexGrow: 1,
          fontFamily: "Inter, sans-serif",
          fontWeight: "bold",
        }}
      >
        Search
      </Typography>
      <CenterBox>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontFamily: "Inter, sans-serif" }}
        >
          <img src={Loupe} alt="Loupe" style={{ opacity: "0.5" }} />
        </Typography>
        <Typography
          variant="h5"
          component="div"
          sx={{ height:"60%", width: "35%", flexGrow: 1, fontFamily: "Inter, sans-serif", textAlign: "center" }}
        >
          We couldn´t find the movies you were lookin for :( 
        </Typography>
      </CenterBox>
    </MainBox>
  );
}

export default Search;
