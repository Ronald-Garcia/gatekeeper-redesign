import { useStore } from "@nanostores/react";
import { $machines } from "@/data/store";
import MachineAdmin from "./machine-admin";

export default function MachinesComponent() {

  const machineList = useStore($machines);

  // useEffect(() =>  {
   
  //   loadUsers();
  //   }, [userList]);


  return (

        <div className="max-h-[20vh] p-4">
        {machineList.length === 0 ? (
        <p> No machines found. Please add some!  </p>
      ) : 
      <div className="space-y-4">

        {machineList.map((m) => (
          <MachineAdmin key={m.id} machine={m}/>
        ))}
        </div>
      }

        </div>


  );
}
