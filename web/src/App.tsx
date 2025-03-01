import Body from "./components/layout/body";
import Header from "./components/layout/header";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <>
      <div className="h-[100vh]">
        <Header />
        <Body></Body>

      </div>  
      <Toaster></Toaster>
    </>
  );
}

export default App;
