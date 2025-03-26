import { User } from "@/data/types/user";
import UserActions from "./user-actions";
import { useState } from "react";
import { selectItem } from "@/data/store";

/* 
User component for each individual user to be used on the list 
@param user: user whose info is going to be displayed when mapping through user list. 
*/
export default function UserComponent({ user }: { user: User }) {
  const [isActive, setIsActive] = useState(false);

  function selectUser() {
    if (!isActive) {
      selectItem(user);
    }
  }

  return (
    <>
      <div
        data-cy={user.cardNum}
        className="relative flex items-center gap-6 p-4 rounded-lg hover:bg-stone-100 transition-all border border-stone-200 hover:border-stone-400 shadow-sm"
        onClick={selectUser}
      >
        <div className="flex-1">
          <h3 className="font-medium text-base">{user.name}</h3>
          <p className="text-sm text-gray-600">Class of {user.graduationYear}</p>
        </div>
        <UserActions
          userId={user.id}
          userNumber={user.cardNum}
          setIsActive={setIsActive}
        />
      </div>
    </>
  );
}
