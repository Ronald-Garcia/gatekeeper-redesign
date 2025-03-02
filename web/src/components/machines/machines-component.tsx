import { useStore } from "@nanostores/react";
import { $machines, $users } from "@/data/store";
import UserComponent from "./machine-admin";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import useQueryUsers from "@/hooks/use-query-users";
import { useEffect } from "react";
import MachineAdmin from "./machine-admin";

export default function MachinesComponent() {
  useQueryUsers(true);

  const machineList = useStore($machines);

  // useEffect(() =>  {
   
  //   loadUsers();
  //   }, [userList]);


  return (
    <ScrollArea>

        <div className="max-h-[20vh]">
        {machineList.length === 0 ? (
        <p> No machines found. Please add some!  </p>
      ) : (
        machineList.map((m) => (
          <MachineAdmin key={m.id} machine={m}/>
        ))
      )}

        </div>
    </ScrollArea>
  );
}
