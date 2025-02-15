import { turnOnMachine } from "@/data/api";
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
            </div>
        </>
    )
}

export default Start;