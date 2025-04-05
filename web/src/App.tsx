import Body from "./components/layout/body";
import Header from "./components/layout/header";
import { Toaster } from "./components/ui/toaster";
// Create main app
function App() {

  // OF note, we import the factoria and Proxima Nova fonts
  return (
    <>
      <Toaster></Toaster>

      <div className="h-[100vh]">
        <Header />
        <Body></Body>

      </div>  
    </>
  );
}

export default App;
