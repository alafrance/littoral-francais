import {MainLayout} from "./layouts/MainLayout.tsx";
import {Route, Routes} from "react-router";
import {Map} from "./components/map/Map.tsx";
import {Report} from "./components/report/Report.tsx";

const App = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path={"/42-Gaia"} element={<Map />} />
        <Route path={"/42-Gaia/report"} element={<Report />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
