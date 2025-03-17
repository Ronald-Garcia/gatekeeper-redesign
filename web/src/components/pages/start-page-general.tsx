import { turnOnMachine } from "@/data/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import useQueryUsers from "@/hooks/use-query-users";
import { redirectPage } from "@nanostores/router";
import { $router } from "@/data/router";

/*
    This is the actual format of the start page, just takes toggles if you do route or not based on parent.
*/
type startPageProps = {
    callPythonServer:boolean
}
const StartPageGeneral = ({callPythonServer}: startPageProps) => {
    var callPython:number = 0;
    if (callPythonServer){
        callPython = 1;
    }

  const [cardNum, setCardNum] = useState("");

  const { validateUser } = useQueryUsers(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNum(e.target.value);
  }

  const handleSubmitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (e.key === "Enter" && cardNum) {
      e.preventDefault();

      const newCardNum = cardNum.substring(1, cardNum.length - 1);
      
      validateUser(Number.parseInt(newCardNum), callPython).then(s => {        
        redirectPage($router, s);
      });
    }
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center h-[100vp] w-[100vp]">
        
        <h1 className="text-3xl">Swipe</h1>

        <h2 className="w-2/4 text-center border-b border-black leading-none my-2.5">
          <span className="px-2 bg-white">or</span>
        </h2>
        <Button
          className="size-"
          onClick={async () => {
            const did_it_work = await turnOnMachine();
          }}
        >
          JHUOAuth
        </Button>

        <Input
          onChange={handleOnChange}
          placeholder="Swipe your card!"
          onKeyDown={handleSubmitOnEnter}
          data-cy="cardnum-input"
        >
        </Input>
      </div>
    </>
  );
};

export default StartPageGeneral;