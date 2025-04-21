import Body from "./components/layout/body";
import Header from "./components/layout/header";
import { Toaster } from "./components/ui/toaster";

function App() {

  // Regular app layout
  return (
    <>
      <Toaster />
      <div className="h-[100vh]">
        <Header />
        <Body />
      </div>
    </>
  );
}

export default App;
