import { Button } from "../ui/button";
import { openPage} from "@nanostores/router";
import { $router } from "@/data/router";

/*

*/
const ErrorPage = () => {

  const handleClickOnGoHome = () => {
    // Redirect to start page.
    openPage($router, "start_page");
  }
  return (
    <div className=" not-found-page">
              <h1 className="items-center text-5xl font-size freight-text-medium">
                404 - Page Not Found
              </h1>
              <p className="text-lg freight-text-medium">
                Oops! The page you are looking for does not exist.
              </p>
              <Button  className="jhu-blue-button" variant={"ghost"} onClick={handleClickOnGoHome}>
                Go back to Home
              </Button>
            </div>
  );
};

export default ErrorPage;