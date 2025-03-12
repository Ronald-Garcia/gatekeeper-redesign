import { useStore } from "@nanostores/react";
import { $users } from "@/data/store";
import UserComponent from "./user";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import useQueryUsers from "@/hooks/use-query-users";

/*
Users component that list complete list of users from the data base, each on a usercomponent 
*/
export default function UsersComponent() {
  useQueryUsers(true);

  const userList = useStore($users);

  return (
    <ScrollArea>

        <div data-cy = "users-component"  className="max-h-[20vh]">
        {userList.length === 0 ? (
        <p> No users found. Please add some!  </p>
      ) : (
        userList.map((user) => (
          <UserComponent key={user.id} user={user}/>
        ))
      )}

        </div>
    </ScrollArea>
  );
}
