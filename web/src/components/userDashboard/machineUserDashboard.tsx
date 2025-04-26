import { Machine } from "@/data/types/machine";
import { JSX, useState } from "react";
import { cn } from "@/lib/utils";
import { Circle } from "lucide-react";

type machineUserDashboardProps = {
    machine: Machine,
    dateLastReload:Date, 
}
export default function MachineUserDashboard({ machine, dateLastReload } : machineUserDashboardProps ) {

const machineDate =  new Date(machine.lastTimeUsed);
//Time in seconds since active
const timeSinceActive = (dateLastReload.getTime() / 1000)  - (machineDate.getTime() / 1000);
enum machineStatuses {
    InUse,
    Available,
    Inactive,
};

let machineStatus:machineStatuses;

// These are the statuses. First, check active inactive. Then, in use. If neither, available.
// Note, inactive overrides in use state.
if (machine.active === 0){
    machineStatus = machineStatuses.Inactive;
} else if (timeSinceActive <= 450) {
    machineStatus = machineStatuses.InUse;
} else {
    machineStatus = machineStatuses.Available;
}

let displayTime = timeSinceActive;
let time = "minute";
if (timeSinceActive / (3600 * 24) >= 7) {
  displayTime = Math.floor(timeSinceActive / (3600 * 24 * 7))
  time = "week"
} else if (timeSinceActive / 3600 >= 24) {
  displayTime = Math.floor(timeSinceActive / (3600 * 24))
  time = "day"
} else if (timeSinceActive / 60 >= 60) {
  displayTime = Math.floor(timeSinceActive / 3600)
  time = "hour"
} else {
  displayTime = Math.floor(timeSinceActive / 60)
}

if (displayTime > 1) {
  time += "s"
}


const details = [{ label: "Hourly Rate", value: `$${machine.hourlyRate}` },
    { label: "Status", value: machine.active === 1 ? "Active" : "Inactive" },
    { label: "Last Used", value: `${Math.round(displayTime)} ${time} ago` }

]
let actions:JSX.Element;
let styling:string;
let borderstyling:string;

if (machineStatus === machineStatuses.Inactive) {
    actions = <div className="flex flex-row items-center gap-5">
      Inactive
      <Circle
          size={12}
          className={"text-red-500"}
          fill={"currentColor"}
        />
    </div>
    styling = "toggle-component"
    borderstyling = "toggle-boarder"
} else if (machineStatus === machineStatuses.InUse) {
    actions = <div className="flex flex-row items-center gap-5">
      In Use
      <Circle
          size={12}
          className={"text-yellow-500"}
          fill={"currentColor"}
        />
    </div>
    styling = "toggle-component"
    borderstyling = "toggle-boarder"

} else {
    actions = <div className="flex flex-row items-center gap-5">
      Available
      <Circle
          size={12}
          className={"text-green-500"}
          fill={"currentColor"}
        />
      </div>
    styling = "toggle-component"
    borderstyling = "toggle-boarder"
}

const [isExpanded, setIsExpanded] = useState(false);

const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
};

return (
      <div
        data-cy={`machine-${machine.id}`}
        className={styling}
      >
        <div 
          className="flex items-center gap-6 p-4 cursor-pointer"
          onClick={handleToggle}
        >
          <div className="flex-1">
            <h3 className="text-base font-medium">{machine.name}</h3>
            <p className="text-sm text-gray-600">{`Type: ${machine.machineType.name}`}</p>
          </div>
          <div className="flex items-center gap-2">
            {actions}
          </div>
        </div>
        <div 
          className={cn(
            "transition-all duration-200 ease-in-out overflow-hidden",
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className={`p-4 space-y-2 border-t ${borderstyling}`}>
            {details.map((detail, index) => (
              <p key={index} className="text-sm">
                <span className="font-medium">{detail.label}:</span> {detail.value}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
}
