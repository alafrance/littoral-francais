import {Map} from "./components/map/Map.tsx";
import {Timeline} from "./components/timeline/Timeline.tsx";
import {MainLayout} from "./layouts/MainLayout.tsx";
import {useSelector} from "react-redux";

const App = () => {
  const map = useSelector((state: any) => state.map);
  return (
    <MainLayout>
      <main className={"w-full h-full flex flex-col "}>
        <Map/>
        {map.stationId && (
          <Timeline/>
        )}
      </main>
    </MainLayout>
  );
};

export default App;
