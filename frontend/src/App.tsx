import {Map} from "./components/Map.tsx";
import {Timeline} from "./components/Timeline.tsx";
import {MainLayout} from "./layouts/MainLayout.tsx";

const App = () => {
  return (
    <MainLayout>
      <main className={"w-full h-full flex flex-col "}>
        <Map/>
        <Timeline/>
      </main>
    </MainLayout>
  );
};

export default App;
