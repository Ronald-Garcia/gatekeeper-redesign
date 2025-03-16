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
          {d.id}

          {d.userId}
          
          {d.machineId}

          {d.budgetCode}
          
          {d.startTime}

          {d.endTime}
        </div>)
      })}
    </div>
  )
}