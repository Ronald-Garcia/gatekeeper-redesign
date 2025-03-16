import * as React from "react"

interface EmailTemplateProps {
  data: FinancialStatementType[];
}


interface FinancialStatementType {
  id: number,
  userId: number,
  budgetCode: number,
  machineId: number,
  startTime: number,
  endTime: number,
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  data
}: EmailTemplateProps) => {
  return (
    <div>
      {data.map(d => {
        return (<div>
          <h1>{d.id}</h1>
          <hr></hr>

          <p>User: {d.userId}</p>
          
          <p>Machine: {d.machineId}</p>

          <p>Budget Code: {d.budgetCode}</p>
          
          <p>Start time: {d.startTime}</p>

          <p>End time: {d.endTime}</p>
        </div>)
      })}
    </div>
  )
}