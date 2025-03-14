import Body from "./components/layout/body";
import Header from "./components/layout/header";
import { Toaster } from "./components/ui/sonner";
// Create main app
function App() {

  // OF note, we import the factoria and Proxima Nova fonts
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
