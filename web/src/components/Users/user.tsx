import { User } from "@/data/types/user";
import UserActions from "./user-actions";
import { useState } from "react";

/* 
User component for each individual user to be used on the list 
@param user: user whose info is going to be displayed when mapping through user list. 
*/
export default function UserComponent({ user }: { user: User }) {
  const [isActive, setIsActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

 

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isActive) {
      setIsExpanded(!isExpanded);
    }
  };

  let role = "User";
  if (user.isAdmin === 1) {
    role = "Admin";
  }

  return (
    <div
      data-cy={user.cardNum}
      className="relative flex flex-col rounded-lg hover:bg-stone-100 transition-all border border-stone-200 hover:border-stone-400 shadow-sm"
    >
      <div 
        className="flex items-center gap-6 p-4 cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex-1">
          <h3 className="font-medium text-base">{user.name}</h3>
          <p className="text-sm text-gray-600">Class of {user.graduationYear}</p>
        </div>
        <UserActions
          user={user}
          setIsActive={setIsActive}
        />
      </div>
      <div 
        className={`transition-all duration-200 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 border-t border-stone-200 space-y-2">
          <p className="text-sm"><span className="font-medium">Card Number:</span> {user.cardNum}{user.lastDigitOfCardNum}</p>
          <p className="text-sm"><span className="font-medium">JHED:</span> {user.JHED}</p>
          <p className="text-sm"><span className="font-medium">Role:</span> {role}</p>
        </div>
      </div>
    </div>
  );
}
