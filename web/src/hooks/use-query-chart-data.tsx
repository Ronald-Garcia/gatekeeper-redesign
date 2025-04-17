import { getFinancialStatements, getUserStatistics } from "@/data/api";
import { $userChart, $date_range, resetDateRange, setChartData } from "@/data/store";
import { SortFinancialType } from "@/data/types/sort";
import { useStore } from "@nanostores/react";
import { toast } from "./use-toast";
import { useEffect } from "react";


export function useQueryChart() {

    const dateRange = useStore($date_range);
    const chartData = useStore($userChart);

    const getChartFinancialStatements = async (
        sort: SortFinancialType = "type_asc",
        page: number = 1,
        limit: number = 10
      ) => {
        try {
            // gets date range
            const now = new Date();

            const past = new Date();
            
            past.setFullYear(now.getFullYear() - 1);
   
            const to = dateRange ? dateRange.to : now;
            const from = dateRange ? dateRange.from : past;

          const {
            data
          } = await getFinancialStatements(sort, page, limit, to as Date, from as Date);
    
          setChartData(data);
    
        } catch (e) {
          const errorMessage = (e as Error).message;
          toast({
            variant: "destructive",
            title: "❌ Sorry! There was an error fetching user statistics 🙁",
            description: errorMessage
          });
        }
    }

    useEffect(() => {
        resetDateRange();
        getChartFinancialStatements();
        getUserChartData();
    }, [])

    // getting & adding time for each day for all days within range
    const getUserChartData = async (
      page: number = 1,
      limit: number = 10,
      precision: "m" | "h" | "d" | "w" = "m",
      budgetCode: number | undefined = undefined,
      machineId: number | undefined = undefined,
    ) => {
      try {

        // getting the date
        const now = new Date();
        const past = new Date();
        past.setFullYear(now.getFullYear() - 1);
        const to = dateRange && dateRange.to ? dateRange.to : now;
        const from = dateRange && dateRange.from ? dateRange.from : past;

        // setting chart data
        const { data } = await getUserStatistics(page, limit, to, from, precision, budgetCode, machineId)
        setChartData(data)
      } catch (e) {
        const errorMessage = (e as Error).message;
        toast({
          variant: "destructive",
          title: "❌ Sorry! There was an error fetching user statistics 🙁",
          description: errorMessage
        });
      }
    }

    return { chartData, getChartFinancialStatements, getUserChartData }
}

export default useQueryChart;