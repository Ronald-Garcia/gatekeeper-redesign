import { useStore } from "@nanostores/react";
import { $users } from "@/data/store";
import UserComponent from "./user";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import useQueryUsers from "@/hooks/use-query-users";

/*
Users component that list complete list of users from the data base, each on a usercomponent 
*/
export default function Users() {
  useQueryUsers(true);

  const userList = useStore($users);

  return (
    <div className="user-collection">
          {userList.length === 0 ? (
            <p data-cy="no-users">No users found!</p>
          ) : 
          <div className="space-y-4">
              {userList.map((user) => (
                <UserComponent key={user.id} user={user} />
              ))}
          </div>
          } 
    </div>
  );
}
