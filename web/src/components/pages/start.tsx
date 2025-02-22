import { turnOnMachine } from "@/data/api";
import { Button } from "../ui/button";


const Start = () => {



    return (
        <>

        <div className="h-2/5 bg-blue flex">
            
        </div>
<div className="flex-center justify-center items-center h-screen">
    <h1 className="text-3xl ">Swipe</h1>

    <h2 className="w-2/4 text-center border-b border-black leading-none my-2.5">
     <span className="bg-white px-2">
        or
     </span>
    </h2>
    <Button className="size-" onClick={ async()=> {
         const did_it_work = await turnOnMachine();

         console.log(did_it_work);
     }}>
     JHUOAuth
 </Button>
        
</div>




        </>
    )
}

export default Start;


/*


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

*/
