import { API_DB_URL, API_MACHINE_URL } from "@/env";
import { User } from "@/components/components/types/user";
import { Training } from "@/components/components/types/training";
import { BudgetCode } from "@/components/components/types/budgetCode";

export const turnOnMachine = async (): Promise<boolean> => {
  const response = await fetch(`${API_MACHINE_URL}/turn-on`, {
    method: "POST",
    credentials: "include",
  });
  const { message }: { message: string } = await response.json();

  if (!response.ok) {
    throw new Error(message);
  }

  return message.startsWith("s");
};

export const getAllUsers = async (): Promise<{
  message: string;
  data: User[];
}> => {
  const response = await fetch(`${API_DB_URL}/users`, {
    credentials: "include",
  });

  if (!response.ok) {
    const { message }: { message: string } = await response.json();

    throw new Error(message);
  }

  const { message, data }: { message: string; data: User[] } =
    await response.json();

  return { message, data };
};

export const editUser = async (user: User): Promise<{
  message: string;
  data: User;
}> => {


  const response = await fetch(`${API_DB_URL}/users/${user.getId()}`, 
  {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user
    }),
    credentials: 'include'
  })

  if (!response.ok) {
    const { message }: { message: string } = await response.json();
    throw new Error(message);
  }

  const { message, data }: { message: string, data: User } = await response.json();
  
  return { message, data };
}

export const removeUser = async (id: number): Promise<{
  message: string;
  data: User;
}> => {
  
  const response = await fetch(`${API_DB_URL}/users/${id}`, {
    method: "DELETE",
    credentials: "include"
  })

  if (!response.ok) {
    const { message }: { message: string } = await response.json();
    throw new Error(message);
  }

  const { message, data }: { message: string, data: User } = await response.json();
  
  return { message, data };
}

export const createUser = async (user: User): Promise<{
  message: string;
  data: User;
}> => {

  const response = await fetch(`${API_DB_URL}/users`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user
    })
  });


  if (!response.ok) {
    const { message }: { message: string } = await response.json();
    throw new Error(message);
  }

  const { message, data }: { message: string, data: User } = await response.json();

  return { message, data };
}

export const validateTraining = async (user_id: number, machine_id: number): Promise<{
  message: string,
  data: boolean
}> => {
  
  const response = await fetch(`${API_DB_URL}/trainings`,{
    credentials: "include",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      user_id,
      machine_id
    })
  });

  if (!response.ok) {
    const { message }: { message: string } = await response.json();
    throw new Error(message);
  }

  const { message }: { message: string } = await response.json();

  return { message, data: true };
}

export const getAllTrainingsOfUser = async (user_id: number): Promise<{
  message: string,
  data: Training[]
}> => {
  const response = await fetch(`${API_DB_URL}/trainings/${user_id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const { message }: { message: string } = await response.json();

    throw new Error(message);
  }

  const { message, data }: { message: string; data: Training[] } =
    await response.json();

  return { message, data };
}

export const createUserMachineRelation = async (user_id: number, machine_id: number): Promise<{
  message: string;
  data: Training;
}> => {

  const response = await fetch(`${API_DB_URL}/trainings`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id,
      machine_id
    }),
    credentials: "include"
  })

  if (!response.ok) {
    const { message }: { message: string } = await response.json();
    throw new Error(message);
  }

  const  { message, data }: { message: string, data: Training } = await response.json();
  return { message, data};

}



export const getAllBudgets = async (): Promise<{
  message: string;
  data: BudgetCode[];
}> => {
  const response = await fetch(`${API_DB_URL}/budget-codes`, {
    credentials: "include",
  });

  if (!response.ok) {
    const { message }: { message: string } = await response.json();

    throw new Error(message);
  }

  const { message, data }: { message: string; data: BudgetCode[] } =
    await response.json();

  return { message, data };
};

export const getAllBudgetsOfUser = async (user_id: number): Promise<{
  message: string;
  data: BudgetCode[];
}> => {
  const response = await fetch(`${API_DB_URL}/budget-codes/${user_id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const { message }: { message: string } = await response.json();

    throw new Error(message);
  }

  const { message, data }: { message: string; data: BudgetCode[] } =
    await response.json();

  return { message, data };
};

export const createBudgetCode = async (budget: BudgetCode): Promise<{
  message: string,
  data: BudgetCode
}> => {
  const response = await fetch(`${API_DB_URL}/budget-codes`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      budget
    }),
    credentials: "include"
  })

  if (!response.ok) {
    const { message }: { message: string } = await response.json();
    throw new Error(message);
  }

  const  { message, data }: { message: string, data: BudgetCode } = await response.json();
  return { message, data};
}

export const deleteBudgetCode = async (id: number): Promise<{
  message: string,
  data: BudgetCode
}> => {
  
  const response = await fetch(`${API_DB_URL}/budget-codes/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  if (!response.ok) {
    const { message }: { message: string } = await response.json();
    throw new Error(message);
  }

  const  { message, data }: { message: string, data: BudgetCode } = await response.json();
  return { message, data};
}

export const editBudgetCode = async (budgetCode: BudgetCode): Promise<{
  message: string,
  data: BudgetCode
}> => {

  const response = await fetch(`${API_DB_URL}/users/${budgetCode.getId()}`, 
  {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      budgetCode
    }),
    credentials: 'include'
  })

  if (!response.ok) {
    const { message }: { message: string } = await response.json();
    throw new Error(message);
  }

  const { message, data }: { message: string, data: BudgetCode } = await response.json();
  
  return { message, data };

}

export const deleteUserMachineRelation = async (training_id: number): Promise<{
  message: string,
  data: Training
}> => {
  

  const response = await fetch(`${API_DB_URL}/trainings/${training_id}`, {
    method: "DELETE",
    credentials: "include"
  });

  if (!response.ok) {
    const { message }: { message: string } = await response.json();
    throw new Error(message);
  }

  const  { message, data }: { message: string, data: Training } = await response.json();
  return { message, data};
}

export const banUser = async (id: number, ban: number): Promise<{
  message: string;
  data: User
}> => {

  const response = await fetch(`${API_DB_URL}/ban-user/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify({
      ban
    })
  });

  if (!response.ok) {
    const { message }: { message: string } = await response.json();
    throw new Error(message);
  }

  const  { message, data }: { message: string, data: User } = await response.json();
  return { message, data};
}




