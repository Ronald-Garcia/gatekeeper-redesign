import { User } from "@/data/types/user";
import UserActions from "./user-actions";




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
