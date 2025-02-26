import { useStore } from "@nanostores/react";
import { $users } from "@/data/store";
import { Button } from "../ui/button";
import UserComponent from "./user";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function UsersComponent() {
  const userList = useStore($users);

  return (
    <ScrollArea>

        <div className="max-h-[20vh]">
        {userList.length === 0 ? (
        <p> No machines found. Please add some!  </p>
      ) : (
        userList.map((user) => (
          <UserComponent key={user.getId()} user={user} />
        ))
      )}

        </div>
    </ScrollArea>
  );
}
