import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React, {  useState } from "react";
import useQueryUsers from "@/hooks/use-query-users";
import { redirectPage } from "@nanostores/router";
import { $router } from "@/data/router";

/*
    This is the actual format of the start page, just takes toggles if you do route or not based on parent.
*/


const InterlockStartPage = () => {
    var callPython:number = 1;

  const [cardNum, setCardNum] = useState("");

  const { validateUser } = useQueryUsers(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNum(e.target.value);
  }

  const handleSubmitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (e.key === "Enter" && cardNum && cardNum.length == 18) {
      e.preventDefault();

      const newCardNum = cardNum.substring(1, cardNum.length - 1);
      
      e.currentTarget.value = "";
      validateUser(Number.parseInt(newCardNum), callPython).then(s => {        
        redirectPage($router, s);
      });
    } else if (e.key === "Enter" && cardNum && cardNum.length == 16){
        e.preventDefault();

        const newCardNum = cardNum;
        
        e.currentTarget.value = "";
        validateUser(Number.parseInt(newCardNum), callPython).then(s => {        
          redirectPage($router, s);
        });
    }
  }

  const handleSignIn = () => {
    const newCardNum = cardNum;
    const input = inputRef.current! ;
    input.value = "";
      validateUser(Number.parseInt(newCardNum), callPython).then(s => {        
        redirectPage($router, s);
      });
    
  }

  const inputRef = React.useRef<HTMLInputElement>(null);
  
  return (
    <div className="items-center sign-in-container ">
      <div className="p-6 space-y-6 rounded-lg shadow-xl kiosk-card ">
        <h1 className="text-4xl font-bold text-center jhu-blue">
          Swipe into Machine
        </h1>
        <h2 className="text-lg text-center text-black">Please swipe your card number to sign in.</h2>

        <div className="flex flex-col space-y-4">
          <Input
            ref = {inputRef}
            onChange={handleOnChange}
            placeholder="Swipe your card"
            onKeyDown={handleSubmitOnEnter}
            className="border-2"
            data-cy="cardnum-input"
            autoFocus={true}
          />
          
          <Button
            onClick={handleSignIn}
            className="text-lg jhu-blue-button"
            variant={"ghost"}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};


export default InterlockStartPage;