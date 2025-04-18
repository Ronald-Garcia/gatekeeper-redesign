import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import useQueryUsers from "@/hooks/use-query-users";
import { redirectPage } from "@nanostores/router";
import { $router } from "@/data/router";
import { setActiveTab } from "@/data/store";

/*
    This is the actual format of the start page, just takes toggles if you do route or not based on parent.
*/


const UserStartPage = () => {
    var callPython:number = 0;

  const [cardNum, setCardNum] = useState("");

  const { validateUser } = useQueryUsers(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNum(e.target.value);
  }

  const handleSubmitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (e.key === "Enter" && cardNum) {
      e.preventDefault();

      const newCardNum = cardNum;
      
      e.currentTarget.value = "";
      validateUser(Number.parseInt(newCardNum), callPython).then(s => {
        if (s === "users") {
            setActiveTab(-1);
            redirectPage($router, "userDashboardMachinesStatus");   
        }
        else {
            redirectPage($router, s);
        }
      });
    }
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center h-[100vp] w-[100vp]">
        <h1 className="text-3xl">Sign into User Dashboard</h1>
        <h2 className="w-2/4 text-center border-b border-black leading-none my-2.5">
        </h2>

        <Input
          onChange={handleOnChange}
          placeholder="Type in your card!"
          onKeyDown={handleSubmitOnEnter}
          data-cy="cardnum-input"
        >
        </Input>
      </div>
    </>
  );
};

export default UserStartPage;