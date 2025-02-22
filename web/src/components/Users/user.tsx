import { User } from "../components/types/user"

export default function UserComponent({user}: {user:User}) {

 
    return (
        <>
        <div>
            <p>{user.getName()} </p>
            <p>{user.getYear()} </p>
        </div>
        </>
    )

}

