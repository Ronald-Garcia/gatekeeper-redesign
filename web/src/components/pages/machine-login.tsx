import Machines from "../machines/machines";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";


const MachineLogin = () => {

    return (
        <>
            <div className="w-[500px] mx-auto h-[400px] max-h-[400px] flex text-xl">
                <Card >
                    <CardHeader>
                        <CardTitle>
                            Select which machine this should be hooked up to!
                        </CardTitle>
                        <CardDescription>
                            This is to determine billing.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Machines>

                        </Machines>
                    </CardContent>
                </Card>

            </div>
        </>
    );

}

export default MachineLogin; 