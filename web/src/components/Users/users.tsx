import { useStore } from "@nanostores/react";
import { users } from "@/data/store";
import { Button } from "../ui/button";
import UserComponent from "./user";

export default function UsersComponent() {
  const userList = useStore(users);

  return (
    <div>
      <h1>Users:</h1>
      <Button>Add User</Button>
      {userList.length === 0 ? (
        <p> No users</p>
      ) : (
        userList.map((user) => (
          <UserComponent key={user.getCardNumber()} user={user} />
        ))
      )}
    </div>
  );
}
