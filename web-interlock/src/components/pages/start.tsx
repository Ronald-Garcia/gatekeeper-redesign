import { getAllUsers, sendToMachine, turnOnMachine } from "@/data/api";
import { Button } from "../ui/button";


const Start = () => {



    return (
        <>
            <div>
                <Button
                    onClick={async () => {
                        const did_it_work = await turnOnMachine();

                        console.log(did_it_work);
                    }}>
                    Tap to start!
                </Button>

                <Button
                    onClick={ async () => {
                        const {message, data} = await getAllUsers();
                        const m = await sendToMachine(message, data);
                        console.log(m);
                    }}
                    >
                    Demo button!
                </Button>
            </div>
        </>
    )
}

export default Start;