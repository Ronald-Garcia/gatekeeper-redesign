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

    return (
        <>
        <div onBlur={clearItem}>
        <p>{selection.name} </p>
        <p>{selection.JHED} </p>
        <p>{selection.cardNum} </p>
        <p>{selection.graduationYear} </p>
        <p>{selection.isAdmin} </p>
        </div>
        </>
    );
    // else display budget Code info 
  }  else {
    return (
    <>
        <div>
        <p>{selection.name} </p>
        <p>{selection.budgetCode} </p>
        <p>{selection.id} </p>
        </div>
        </>
    )
  }


}
