import { API_DB_URL, API_MACHINE_URL } from "@/env";
import { User } from "./types/user";
import { Training } from "./types/training"; 
import { BudgetCode } from "./types/budgetCode"; 
import { Machine } from "./types/machine";
import { MachineType } from "./types/machineType";
import { SortType } from "./types/sort";

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



export const getAllUsers = async (
  sort: SortType = "name_asc",
  page: number = 1,
  limit: number = 10,
  search: string = ""

): Promise<{
  message: string;
  data: User[];
}> => {
  const response = await fetch(`${API_DB_URL}/users?search=${search}&limit=${limit}&page=${page}&sort=${sort}`, {
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


  const response = await fetch(`${API_DB_URL}/users/${user.id}`, 
  {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: user.name,
      lastDigitOfCardNum: user.lastDigitOfCardNum,
      graduationYear: user.graduationYear,
      isAdmin: user.isAdmin
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

export const getUser = async (cardNum: number): Promise<{
  message: string;
  data: User
}> => {

  const response = await fetch(`${API_DB_URL}/users/${Math.floor(cardNum / 10)}/${cardNum % 10}`, {
    credentials: "include",
  });

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
      ...user
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
    method: "POST",
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

export const createUserMachineRelation = async (userId: number, machineTypeId: number): Promise<{
  message: string;
  data: Training;
}> => {

  const response = await fetch(`${API_DB_URL}/trainings`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      machineTypeId
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
      ...budget
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

  const response = await fetch(`${API_DB_URL}/users/${budgetCode.id}`, 
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



export const fetchCurrentMachine = async (): Promise<{
    message: string,
    data: number
  }> => {

  const response = await fetch(`${API_MACHINE_URL}/whoami`,{
    credentials: "include"
  })

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { message, data}: { message: string, data: number } = await response.json();

  return { message, data };
}

export const saveCurrentMachine = async (machine_id: number): Promise<{
  message: string;
  data: boolean;
}> => {

  const response = await fetch(`${API_MACHINE_URL}/whoami`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: machine_id
    })
  });

  if (!response.ok) {
    const { message }: { message: string} = await response.json();
    throw new Error(message);
  }

  const { message, data }: { message: string, data: boolean } = await response.json();

  return { message, data };
}





export const getAllMachines = async (
  sort: SortType = "name_asc",
  page: number = 1,
  limit: number = 10,
  search: string = ""

): Promise<{
  message: string;
  data: Machine[];
}> => {
  const response = await fetch(`${API_DB_URL}/machines/searchByName?search=${search}&limit=${limit}&page=${page}&sort=${sort}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const { message }: { message: string } = await response.json();

    throw new Error(message);
  }

  const { message, data }: { message: string; data: Machine[] } =
    await response.json();

    console.log(data);

  return { message, data };
};
export const getMachine = async (id: number): Promise<{
  message: string;
  data: Machine
}> => {

  const response = await fetch(`${API_DB_URL}/machines/${id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const { message }: { message: string } = await response.json();
    throw new Error(message);
  }

  const { message, data }: { message: string, data: Machine } = await response.json();
  
  return { message, data };
}

export const createMachineType = async (type: string): Promise<{
  message: string;
  data: MachineType
}> => {
  const response = await fetch(`${API_DB_URL}/machine-types`,{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      machineType: type
    }),
    credentials: "include"
  });

  if (!response.ok) {
    const { message }: { message: string} = await response.json();
    throw new Error(message);
  }

  const { message, data }: { message: string, data: MachineType } = await response.json();

  return { message, data };
}


export const updateMachineType = async (type: string): Promise<{
  message: string;
  data: MachineType
}> => {
  const response = await fetch(`${API_DB_URL}/machine-types`,{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      machineType: type
    }),
    credentials: "include"
  });

  if (!response.ok) {
    const { message }: { message: string} = await response.json();
    throw new Error(message);
  }

  const { message, data }: { message: string, data: MachineType } = await response.json();

  return { message, data };
}

export const deleteMachineType = async (id: number): Promise<{
  message: string;
  data: MachineType
}> => {
  const response = await fetch(`${API_DB_URL}/machine-types/${id}`,{
    method: "DELETE",
    headers: {"Content-Type": "application/json"},
    credentials: "include"
  });

  if (!response.ok) {
    const { message }: { message: string} = await response.json();
    throw new Error(message);
  }

  const { message, data }: { message: string, data: MachineType } = await response.json();

  return { message, data };
}

export const getMachineTypes = async ( sort: SortType = "type_asc",
  page: number = 1,
  limit: number = 10,
  search: string = ""

): Promise<{
  message: string;
  data: MachineType[];
}> => {
  const response = await fetch(`${API_DB_URL}/machine-types?search=${search}&limit=${limit}&page=${page}&sort=${sort}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const { message }: { message: string} = await response.json();
    throw new Error(message);
  }

  const { message, data }: { message: string, data: MachineType[] } = await response.json();

  return { message, data };
}




export const createMachine = async (name: string, type: MachineType, rate: number): Promise<{
  message: string;
  data: Machine
}> => {

  console.log(type.id)
  const response = await fetch(`${API_DB_URL}/machines`,{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      name,
      machineTypeId: type.id,
      hourlyRate: rate
    }),
    credentials: "include"
  });

  if (!response.ok) {
    const { message }: { message: string} = await response.json();
    throw new Error(message);
  }

  const { message, data }: { message: string, data: Machine } = await response.json();

  return { message, data };

}

export const deleteMachine = async (id: number) => {
  const response = await fetch(`${API_DB_URL}/machines/${id}`,{
    method: "DELETE",
    credentials: "include"
  });

  if (!response.ok) {
    const { message }: { message: string} = await response.json();
    throw new Error(message);
  }

  const { message, data }: { message: string, data: Machine } = await response.json();

  return { message, data };
}

