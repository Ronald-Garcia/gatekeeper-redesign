import Body from "./components/layout/body";
import Header from "./components/layout/header";
import { Toaster } from "./components/ui/toaster";
import FormPage from "@/components/pages/form";

function App() {
  const pathname = window.location.pathname;

  
  if (pathname.match(/^\/form\/\d+\/\d+$/)) {
    return (
      <>
        <Toaster />
        <FormPage />
      </>
    );
  }

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
