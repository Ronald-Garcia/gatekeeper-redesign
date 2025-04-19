import {  useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useMutationMachineIssue from "@/hooks/use-mutation-machineIssue";
import { Textarea } from "../ui/textarea";
import useQueryMachines from "@/hooks/use-query-machines";

const FormPage = () => {
  const [userID, setUserID] = useState<number | null>(null);
  const [machineID, setMachineID] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { reportIssue  } = useMutationMachineIssue();
  const { loadMachines } = useQueryMachines(false);


  const handleSubmit = async () => {
    if (!userID || !machineID || !description.trim()) return;

    const issue = await reportIssue(userID, machineID, description.trim());
    if (issue) {
      setSubmitted(true);
    }
  };

  const curMachine = loadMachines(undefined, undefined, undefined, "")

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Submitted ✅</h1>
        <p className="text-gray-600">Thank you for reporting the maintenance issue.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Maintenance Report</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Reporting for machine <strong>{machineID}</strong>
          </p>
          <Textarea
            className="resize-none"
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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


