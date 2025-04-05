import { $activeTab, resetSearch, setActiveTab } from "@/data/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { $router } from "@/data/router";
import useQueryUsers from "@/hooks/use-query-users";
import useQueryMachines from "@/hooks/use-query-machines";


const InactiveTab = () => {

    const activeTab = useStore($activeTab);

    const router = useStore($router);

    const { loadUsers } = useQueryUsers(false);
    const { loadMachines } = useQueryMachines(false);

    useEffect(() => {
        if (router!.route === "users") {
            loadUsers();
        } else if (router!.route === "machines") {
            loadMachines();
        }
    }, [activeTab])

    return (

        <Tabs defaultValue="active" data-cy="active-tabs">
                    <TabsList className="w-full">
                        <TabsTrigger onClick={() => {setActiveTab(1); resetSearch()}} value="active" className="w-full"> Active </TabsTrigger>
                        <TabsTrigger onClick={() => {setActiveTab(0); resetSearch()}} value="inactive" className="w-full"> Inactive </TabsTrigger>
                    </TabsList>

                    <TabsContent value="active">
                    </TabsContent>

                    <TabsContent value="inactive">
                    </TabsContent>
                </Tabs>


    );
}

export default InactiveTab;