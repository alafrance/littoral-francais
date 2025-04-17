import {Map} from "./components/map/Map.tsx";
import {MainLayout} from "./layouts/MainLayout.tsx";

const App = () => {
  return (
    <MainLayout>
      <main className={"w-full h-full flex flex-col "}>
        <Map/>
      </main>
    </MainLayout>
  );
};

export default App;
