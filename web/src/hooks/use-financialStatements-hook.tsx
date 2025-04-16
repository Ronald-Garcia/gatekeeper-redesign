import { getFinancialStatements } from "@/data/api";
import {
  $date_range,
  $statements, 
  setChartData, 
  setFinancialStatements,
  setMetaData,
 } from "@/data/store";
import {  } from "@/data/types/budgetCode";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { useToast } from "./use-toast";
import { SortFinancialType } from "@/data/types/sort";

function useQueryStatements(reload: boolean) {
  const statements = useStore($statements);
  const dateRange = useStore($date_range);
  const { toast } = useToast();
  
  const loadFinancialStatements = async (
      sort: SortFinancialType = "type_asc",
      page: number = 1,
      limit: number = 10) => {
    try {
      const {
        data: fetchedFinancialStatements,
        meta: fetchedMetaData
      } = await getFinancialStatements(sort,page,limit, dateRange!.to as Date, dateRange!.from as Date);
      setMetaData(fetchedMetaData);
      setFinancialStatements(fetchedFinancialStatements);
    } catch (e) {
      const errorMessage = (e as Error).message;
      toast({
        variant: "destructive",
        title: "❌ Sorry! There was an error fetching financial statements 🙁",
        description: errorMessage
      });
    }
  };

  const getChartFinancialStatements = async (
    sort: SortFinancialType = "type_asc",
    page: number = 1,
    limit: number = 10
  ) => {
    try {

      const {
        data
      } = await getFinancialStatements(sort, page, limit, dateRange!.to as Date, dateRange!.from as Date);

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
    if (reload) {
      loadFinancialStatements();
    }
  }, []);

  return { statements, loadFinancialStatements};
}

export default useQueryStatements;
