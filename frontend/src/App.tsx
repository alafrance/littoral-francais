import React from "react";
import MapComponent from "./components/map/MapComponent.tsx";
import {Timeline} from "./components/Timeline.tsx";
import {MainLayout} from "./layouts/MainLayout.tsx";

const App: React.FC = () => {
  return (
    <MainLayout>
      <main className={"w-full h-full flex flex-col "}>
        {/*<SidebarTrigger />*/}
        <MapComponent/>
        <Timeline/>
      </main>
    </MainLayout>
  );
};

export default App;
