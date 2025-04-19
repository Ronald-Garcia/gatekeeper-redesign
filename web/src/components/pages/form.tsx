import {  useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useMutationMachineIssue from "@/hooks/use-mutation-machineIssue";
import { Textarea } from "../ui/textarea";
import useQueryMachines from "@/hooks/use-query-machines";
import { useStore } from "@nanostores/react";
import { $machine } from "@/data/store";
import { redirectPage } from "@nanostores/router";
import { $router } from "@/data/router";

type formProps = {
  userId : string,
  machineId:string
}

const FormPage = ({userId, machineId}: formProps) => {

  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { reportIssue  } = useMutationMachineIssue();
  const { loadMachine } = useQueryMachines(false);

  const [ gotMachine, setGotMachine] = useState(false);

  const userIdNum = Number(userId);
  const machineIdNum = Number(machineId);
  const machine = useStore($machine);

if (!gotMachine) {
  setGotMachine(true);
  loadMachine(machineIdNum);
}

const [formLengthError, setFormLengthError] = useState(false);

const handleOnChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
  setDescription(e.target.value);
  setFormLengthError(false);
}

  const handleSubmit = async () => {
    if (!userId || !machineId || !description.trim()) return;

    if (description.length < 5) {
      setFormLengthError(true);
      return;
    }
    setFormLengthError(false);    

    const issue = await reportIssue(userIdNum, machineIdNum, description.trim());
    if (issue) {
      setSubmitted(true);
    }
  };

  const handleGoHome = () => {
    redirectPage($router, "start_page")    
  }
  
  // className={errors.name ? "border-red-500" : ""}

  if (submitted) {
    return (
      <div className="flex-col reportpage">
        <h1 className="text-2xl font-bold ">Submitted ✅</h1>
        <p className="text-gray-600 pt-[10px] pb-[15px]">Thank you for reporting the maintenance issue.</p>
        <Button
            onClick={handleGoHome}
            className="jhu-blue-button "
            variant={"ghost"}
          >
            Return Home
          </Button>
      </div>
    );
  }

  let errorMessage :string ;

  if (formLengthError) {
    errorMessage = "Please make the report longer then 5 characters";
  } else {
    errorMessage = "";
  }

  return (
    <div className=" reportpage bg-gray-50">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="text-xl">Maintenance Report</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-gray-600 ">
            Reporting for machine <strong>{machine.name}</strong>
          </p>
          <p className="text-red-500 ">
            {errorMessage}
          </p>
          <Textarea
            className={formLengthError ? "border-red-500 resize-none" : "resize-none"}
            placeholder="Describe the issue..."
            value={description}
            onChange={handleOnChange}
          />
          <Button
            onClick={handleSubmit}
            className="text-white bg-red-500 hover:bg-red-600"
            disabled={!description.trim()}
          >
            Submit Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormPage;


