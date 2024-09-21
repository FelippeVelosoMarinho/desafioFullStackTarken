import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MyLibrary from "../pages/MyLibrary";
import Search from "../pages/Search";
import Topbar from "../components/Topbar/Topbar";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Topbar />}>
          <Route index element={<MyLibrary />} />
          <Route path="/search" element={<Search />} />
        </Route>

        <Route
          path="*"
          element={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <h1>
                Not Found
                <br />
                --- 404 ---
              </h1>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
