import { User } from "@/data/types/user";
import UserActions from "./user-actions";



/* 
User component for each individual user to be used on the list 
@param user: user whose info is going to be displayed when mapping through user list. 
*/
export default function UserComponent({ user }: { user: User }) {
  return (
    <>
      <div className="relative flex flex-col justify-between items-center py-4 max-h-[15vh] text-sm text-clip hover:bg-stone-100 transition-colors border-y-2 border-solid border-stone-300 hover:border-stone-500">
        <UserActions  userId={user.id}></UserActions>
        <p>{user.name} </p>
        <p>{user.graduationYear} </p>
      </div>
    </>
  );
}
