import { getFinancialStatements } from "@/data/api";
import { $chart_data, $date_range, resetDateRange, setChartData } from "@/data/store";
import { SortFinancialType } from "@/data/types/sort";
import { useStore } from "@nanostores/react";
import { toast } from "./use-toast";
import { useEffect } from "react";


export function useQueryChart() {

    const dateRange = useStore($date_range);
    const chartData = useStore($chart_data);

    const getChartFinancialStatements = async (
        sort: SortFinancialType = "type_asc",
        page: number = 1,
        limit: number = 10
      ) => {
        try {

        
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
            title: "❌ Sorry! There was an error fetching financial statements 🙁",
            description: errorMessage
          });
        }
    }

    useEffect(() => {
        resetDateRange();
        getChartFinancialStatements();
    }, [])

    // getting & adding time for each day for all days within range
    const getAllTimeChartData = async () => {
      
    }

    return { chartData, getChartFinancialStatements }
}

export default useQueryChart;