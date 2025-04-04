import { User } from "@/data/types/user";
import UserActions from "./user-actions";
import ToggleableItem from "./toggleable-item";

/* 
User component for each individual user to be used on the list 
@param user: user whose info is going to be displayed when mapping through user list. 
*/
export default function UserComponent({ user }: { user: User }) {
  let role = "User";
  if (user.isAdmin === 1) {
    role = "Admin";
  }

  return (
    <ToggleableItem
      title={user.name}
      subtitle={`${role} • Class of ${user.graduationYear}`}
      details={[
        { label: "Card Number", value: user.cardNum },
        { label: "JHED", value: user.JHED },
        { label: "Role", value: role }
      ]}
      actions={
        <UserActions
          userId={user.id}
          userNumber={user.cardNum}
        />
      }
      dataCy={user.cardNum}
    />
  );
}
