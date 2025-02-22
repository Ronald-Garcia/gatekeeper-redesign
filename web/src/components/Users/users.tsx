import { useStore } from "@nanostores/react";
import { users } from "@/data/store";
import UserComponent from "./user";

export default function UsersComponent(){
    const userList = useStore(users);

    return (
        <div>
            <h1>Users:</h1>
                {userList.length ===0 ? (
                    <p> No users</p>
                ):(
                        userList.map((user) => ( 
                            <UserComponent key={user.getCardNumber()}user={user}/> 
                        ))
                )}
        </div>
    );


}