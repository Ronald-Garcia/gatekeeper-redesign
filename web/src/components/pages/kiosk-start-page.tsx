import { Input } from "../ui/input";
import React, {  useState } from "react";
import useQueryUsers from "@/hooks/use-query-users";
import { redirectPage } from "@nanostores/router";
import { $router } from "@/data/router";
import { AdminStartButton } from "./admin-start-button";

/*
    This is the actual format of the start page, just takes toggles if you do route or not based on parent.
*/


const KioskStartPage = () => {
    var callPython:number = 0;

  const [cardNum, setCardNum] = useState("");
  const [jhed, setJhed] = useState("");

  const { validateUserCard, validateUserJHED } = useQueryUsers(false);

  const handleOnChangeCard = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNum(e.target.value);
  }
  const handleOnChangeJhed = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJhed(e.target.value);
  }

  const handleSubmitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (e.key === "Enter" && cardNum && cardNum.length == 18) {
      e.preventDefault();

      const newCardNum = cardNum.substring(1, cardNum.length - 1);
      
      e.currentTarget.value = "";
      validateUserCard(Number.parseInt(newCardNum), callPython).then(s => {        
        redirectPage($router, s);
      });
    } else if (e.key === "Enter" && cardNum && cardNum.length == 16){
        e.preventDefault();

        const newCardNum = cardNum;
        
        e.currentTarget.value = "";
        validateUserCard(Number.parseInt(newCardNum), callPython).then(s => {        
          redirectPage($router, s);
        });
    }
  }

  const handleCardSignIn = () => {
    const newCardNum = cardNum;
    const input = inputCardRef.current! ;
    input.value = "";
      validateUserCard(Number.parseInt(newCardNum), callPython).then(s => {        
        return s;
      });
    
  }


  const handleJhedSignIn = () => {
    const newJhed = jhed;
    const input = inputJhedRef.current! ;
    input.value = "";
      validateUserJHED(newJhed, callPython).then(s => {       
         return s;
      });
    
  }

  const inputCardRef = React.useRef<HTMLInputElement>(null);
  const inputJhedRef = React.useRef<HTMLInputElement>(null);
  
  return (
    <div className="items-center sign-in-container ">
      <div className="p-6 space-y-6 rounded-lg shadow-xl kiosk-card ">
        <h1 className="text-4xl font-bold text-center jhu-blue">
          Swipe into Kiosk
        </h1>
        <h2 className="text-lg text-center text-black">Please swipe or type your card number to sign in.</h2>

        <div className="flex flex-col space-y-4">
          <Input
            ref = {inputCardRef}
            onChange={handleOnChangeCard}
            placeholder="Swipe or type your card"
            onKeyDown={handleSubmitOnEnter}
            className="border-2"
            data-cy="cardnum-input"
            autoFocus={true}
          />

          <div
            onClick={handleCardSignIn}
          >
            <AdminStartButton></AdminStartButton>
          </div>

          <h3 className="text-sm text-center text-black">
            
               <hr className="b-2"></hr> 
               
               <div className="p-4">
                Or
                </div> 

               <hr className=""></hr>

</h3>
          <Input
            ref = {inputJhedRef}
            onChange={handleOnChangeJhed}
            placeholder="Type your JHED"
            onKeyDown={handleSubmitOnEnter}
            className="border-2"
            data-cy="jhed-input"
            autoFocus={true}
          />
          
          <div
            onClick={handleJhedSignIn}
          >
            <AdminStartButton></AdminStartButton>
          </div>
        </div>
      </div>
    </div>
  );
};


export default KioskStartPage;