import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "../financialStatements/datepick";
import DatePickerWithRange from "../financialStatements/datepicker";
import GeneralizedFilter from "../general/filtering";
import { useStore } from "@nanostores/react";
import { $precision, setPrecision } from "@/data/store";


const UserDashboardChartHeader = () => {

    const precision = useStore($precision);


    return (
        <div className="flex flex-row items-center justify-center gap-2 py-5 space-y-0 ">
          <GeneralizedFilter filters={["userMachineType", "userBudgetType"]}></GeneralizedFilter>
          {/* {precision === "m" && <TimePickerInput date={dateChoice} setDate={setDate} picker="hours"></TimePickerInput>} */}
          {precision === "d" && <DatePickerWithRange></DatePickerWithRange>}
          { (precision === "h" || precision === "m") && <DatePicker></DatePicker>}
          <div className="">
          <Select value={precision} onValueChange={setPrecision}>
            <SelectTrigger>
              <SelectValue placeholder="Days" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="m">
                Minutes
              </SelectItem> */}
              <SelectItem value="h">
                Hours
              </SelectItem>
              <SelectItem value="d">
                Days
              </SelectItem>
              {/* <SelectItem value="w">
                Weeks
              </SelectItem>
              <SelectItem value="mo">
                Months
              </SelectItem>
              <SelectItem value="y">
                Years
              </SelectItem> */}
            </SelectContent>
          </Select>
          </div>

          
        </div>
    )

}

export default UserDashboardChartHeader;