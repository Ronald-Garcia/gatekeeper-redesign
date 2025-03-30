import { $selected, clearItem } from "@/data/store";
import { User } from "@/data/types/user";
import { BudgetCode } from "@/data/types/budgetCode";
import { useStore } from "@nanostores/react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

//type guard to see if selection is user or budget code
function isUser(selection: any): selection is User {
    return selection && "JHED" in selection;
}

export default function UserInfo() {
    const selection = useStore($selected);
    const [isExpanded, setIsExpanded] = useState(true);

    if (!selection) return null;

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    // display User Info
    if (isUser(selection)) {
        let role = "User";
        if (selection.isAdmin === 1) {
            role = "Admin";
        }

        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                    onClick={handleToggle}
                >
                    <div>
                        <h3 className="font-medium text-lg">{selection.name}</h3>
                        <p className="text-sm text-gray-600">JHED: {selection.JHED}</p>
                    </div>
                    <ChevronDown 
                        className={cn(
                            "w-5 h-5 text-gray-500 transition-transform duration-200",
                            isExpanded ? "transform rotate-180" : ""
                        )} 
                    />
                </div>
                <div 
                    className={cn(
                        "transition-all duration-200 ease-in-out",
                        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                >
                    <div className="p-4 border-t border-gray-100 space-y-2">
                        <p className="text-sm"><span className="font-medium">Card Number:</span> {selection.cardNum}</p>
                        <p className="text-sm"><span className="font-medium">Year:</span> {selection.graduationYear}</p>
                        <p className="text-sm"><span className="font-medium">Role:</span> {role}</p>
                    </div>
                </div>
            </div>
        );
    } else {
        // display Budget Code info
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                    onClick={handleToggle}
                >
                    <div>
                        <h3 className="font-medium text-lg">{selection.name}</h3>
                        <p className="text-sm text-gray-600">Code: {selection.code}</p>
                    </div>
                    <ChevronDown 
                        className={cn(
                            "w-5 h-5 text-gray-500 transition-transform duration-200",
                            isExpanded ? "transform rotate-180" : ""
                        )} 
                    />
                </div>
                <div 
                    className={cn(
                        "transition-all duration-200 ease-in-out",
                        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                >
                    <div className="p-4 border-t border-gray-100 space-y-2">
                        <p className="text-sm"><span className="font-medium">ID:</span> {selection.id}</p>
                    </div>
                </div>
            </div>
        );
    }
}
