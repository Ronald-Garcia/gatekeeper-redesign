import { useStore } from "@nanostores/react";
import { $users } from "@/data/store";
import UserComponent from "./user";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import useQueryUsers from "@/hooks/use-query-users";

export default function UsersComponent() {
  const userList = useStore($users);


  useQueryUsers(true);

  return (
    <ScrollArea>

        <div className="max-h-[20vh]">
        {userList.length === 0 ? (
        <p> No users found. Please add some!  </p>
      ) : (
        userList.map((user) => (
          <UserComponent key={user.id} user={user} />
        ))
      )}

        </div>
    </ScrollArea>
  );
}
