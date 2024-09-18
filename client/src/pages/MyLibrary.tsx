import Loupe from "../assets/loupe.svg";
import { CenterBox, MainBox } from "../components/Components";
import Typography from "@mui/material/Typography";

function MyLibrary() {
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
        My Library
      </Typography>
      <CenterBox>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontFamily: "Inter, sans-serif" }}
        >
          <img src={Loupe} alt="Loupe" style={{ height: 165 }} />
        </Typography>
        <Typography
          variant="h4"
          component="div"
          sx={{ flexGrow: 1, fontFamily: "Inter, sans-serif" }}
        >
          It looks like there are no movies in your library! Search for a movie
          you have watched and add it here!
        </Typography>
      </CenterBox>
    </MainBox>
  );
}

export default MyLibrary;
