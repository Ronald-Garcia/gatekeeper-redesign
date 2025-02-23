import { useState } from "react";
import { User } from "../components/types/user";
import UserActions from "./user-actions";




export default function UserComponent({ user }: { user: User }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <>
      <div>
        <UserActions isActive={setIsActive} userId={user.getCardNumber()}></UserActions>
        <p>{user.getName()} </p>
        <p>{user.getYear()} </p>
      </div>
    </>
  );
}
