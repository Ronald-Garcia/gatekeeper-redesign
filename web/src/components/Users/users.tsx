import { useStore } from "@nanostores/react";
import { $users } from "@/data/store";
import UserComponent from "./user";
import useQueryUsers from "@/hooks/use-query-users";
import { ScrollArea } from "../ui/scroll-area";

/*
Users component that list complete list of users from the data base, each on a usercomponent 
*/
export default function UsersComponent() {
  useQueryUsers(true);

  const userList = useStore($users);

  return (
    <div className="p-6">
      <ScrollArea className="h-[70vh] w-full rounded-md border border-gray-200">
        <div data-cy="users-component" className="space-y-4 p-4">
          {userList.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-xl text-gray-500 font-medium">
                No users found. Please add some!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userList.map((user) => (
                <UserComponent key={user.id} user={user} />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
