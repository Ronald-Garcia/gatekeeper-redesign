import Body from "./components/layout/body";
import Header from "./components/layout/header";
import { Toaster } from "./components/ui/sonner";
// Create main app
function App() {

  // OF note, we import the factoria and Proxima Nova fonts
  return (
    <>
    <head>
      <link rel="stylesheet" href="https://use.typekit.net/vxy8tas.css"></link>
      <link rel="stylesheet" href="https://use.typekit.net/jge8wgr.css"></link>
      <link rel="stylesheet" href="https://use.typekit.net/lnm5qra.css"></link>
    </head>
      <div className="h-[100vh]">
        <Header />
        <Body></Body>

      </div>  
      <Toaster></Toaster>
    </>
  );
}

export default App;
