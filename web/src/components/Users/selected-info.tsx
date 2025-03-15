import { $selected, clearItem} from "@/data/store";
import { User } from "@/data/types/user";
import { useStore } from "@nanostores/react";



//type guard to see if selection is user or budget code
function isUser(selection: any ): selection is User {
    return selection && "JHED" in selection;
}


export default function UserInfo() {

    const selection = useStore($selected);

    if (!selection) return <></>; 
    // display User Info
    if (isUser(selection)){
      let role = "User"
      if (selection.isAdmin === 1) {
        role = "Admin"
      }

    return (
        <>
        <div className = "Userinfo"onBlur={clearItem}>
        <p>Name: {selection.name} </p>
        <p>JHED: {selection.JHED} </p>
        <p>Card Number:{selection.cardNum} </p>
        <p>Year: {selection.graduationYear} </p>
        <p>Role: {role} </p>
        </div>
        </>
    );
    // else display budget Code info 
  }  else {
    return (
    <>
        <div>
        <p>{selection.name} </p>
        <p>{selection.code} </p>
        <p>{selection.id} </p>
        </div>
        </>
    )
  }


}
