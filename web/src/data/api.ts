import { API_DB_URL, API_MACHINE_URL } from "../env";
import { User } from "./types/user";
import { Training } from "./types/training"; 
import { BudgetCode } from "./types/budgetCode"; 
import { Machine } from "./types/machine";
import { MachineType } from "./types/machineType";
import { SortBudgetType, SortType } from "./types/sort";
import { financialStatement } from "./types/financialStatement";

/**
 * Turns on the machine.
 * @returns {Promise<boolean>} returns true if the response message starts with "s".
 * @throws {Error} If the response is not ok, throws error with the response message.
 */

export const turnOffMachine = async (): Promise<boolean> => {
  const response = await fetch(`${API_MACHINE_URL}/turn-off`, 
    {
    method: "POST",
    credentials: "include",
  });
  const { message }: { message: string } = await response.json();

  if (!response.ok) {
    throw new Error(message);
  }

  return message.startsWith("s");
};

/**
 * Turns on the machine.
 * @returns {Promise<boolean>} returns true if the response message starts with "s".
 * @throws {Error} If the response is not ok, throws error with the response message.
 */

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


/*
User api functions 
*/


/**
 * Retrieves all users with optional sorting, pagination, and search.
 * @param {SortType} sort - Sorting order, default "name_asc".
 * @param {number} page - Page number, default 1.
 * @param {number} limit - Number of users per page, default 10.
 * @param {string} search - Search term, default empty string.
 * @returns {Promise<{message: string; data: User[]}>} A promise that resolves with a message and an array of users.
* @throws {Error} If the response is not ok, throws error with the response message.
 */
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


/**
 * Edits an existing user.
 * @param {User} user - The user object containing updated properties.
 * @returns {Promise<{message: string; data: User}>} A promise that resolves with a message and the updated user.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
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


/**
 * Removes a user by their ID.
 * @param {number} id - The ID of the user to remove.
 * @returns {Promise<{message: string; data: User}>} A promise that resolves with a message and the removed user.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
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



/**
 * Retrieves a user based on the card number.
 * @param {number} cardNum - The card number of the user.
 * @returns {Promise<{message: string; data: User}>} A promise that resolves with a message and the user data.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
export const getUser = async (cardNum: number): Promise<{
  message: string;
  data: User
}> => {

  let cardNums: string = String(cardNum);
  while (cardNums.length < 16) {
    cardNums = "0".concat(cardNums);
  }

  const response = await fetch(`${API_DB_URL}/users/${cardNums}`, {
    credentials: "include",
  });
  console.log(response)

  if (!response.ok) {
    const { message }: { message: string } = await response.json();
    throw new Error(message);
  }

  const { message, data }: { message: string, data: User } = await response.json();
  
  return { message, data };
}


/**
 * Creates a new user.
 * @param {User} user - The user object to create.
 * @returns {Promise<{message: string; data: User}>} A promise that resolves with a message and the created user.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
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



/**
 * Validates a training session for a user and machine.
 * @param {number} user_id - The ID of the user.
 * @param {number} machine_id - The ID of the machine.
 * @returns {Promise<{message: string, data: boolean}>} A promise that resolves with a message and true if validation succeeds.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
export const validateTraining = async (user_id: number, machine_id: number): Promise<{
  message: string,
  data: boolean
}> => {
  
  const response = await fetch(`${API_DB_URL}/trainings/${user_id}/${machine_id}`,{
    method: "GET",
    credentials: "include",
    headers: {"Content-Type": "application/json"}
  });

  if (!response.ok) {
    const { message }: { message: string } = await response.json();
    throw new Error(message);
  }

  const { message }: { message: string } = await response.json();

  return { message, data: true };
}


/**
 * Retrieves all training sessions for a specific user.
 * @param {number} user_id - The ID of the user.
 * @returns {Promise<{message: string, data: Training[]}>} A promise that resolves with a message and an array of trainings.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
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



/**
 * Creates a relation between a user and a machine type (training session).
 * @param {number} userId - The ID of the user.
 * @param {number} machineTypeId - The ID of the machine type.
 * @returns {Promise<{message: string, data: Training}>} A promise that resolves with a message and the created training relation.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
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


/*
BudgetCode API functions 
*/

/**
 * Retrieves all budget codes.
 * @returns {Promise<{message: string; data: BudgetCode[]}>} A promise that resolves with a message and an array of budget codes.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
export const getAllBudgets = async (
  sort: SortBudgetType = "name_asc",
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<{
  message: string;
  data: BudgetCode[];
}> => {
  const response = await fetch(`${API_DB_URL}/budget-codes?search=${search}&limit=${limit}&page=${page}&sort=${sort}`, {
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

/**
 * Retrieves all budget codes associated with a specific user.
 * @param {number} user_id - The ID of the user.
 * @returns {Promise<{message: string; data: BudgetCode[]}>} A promise that resolves with a message and an array of budget codes.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
export const getAllBudgetsOfUser = async (user_id: number): Promise<{
  message: string;
  data: BudgetCode[];
}> => {
  const response = await fetch(`${API_DB_URL}/user-budgets/${user_id}`, {
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


/**
 * Creates a new budget code.
 * @param {BudgetCode} budget - The budget code object to create.
 * @returns {Promise<{message: string, data: BudgetCode}>} A promise that resolves with a message and the created budget code.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
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


/**
 * Deletes a budget code by its ID.
 * @param {number} id - The ID of the budget code to delete.
 * @returns {Promise<{message: string, data: BudgetCode}>} A promise that resolves with a message and the deleted budget code.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
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

/*
export const editBudgetCode = async (budgetCode: BudgetCode): Promise<{
  message: string,
  data: BudgetCode
}> => {

  const response = await fetch(`${API_DB_URL}/budget-codes/${budgetCode.id}`, 
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
*/

/*
Machine relation API functions
*/


/**
 * Deletes a user-machine (training) relation by training ID.
 * @param {number} training_id - The ID of the training session to delete.
 * @returns {Promise<{message: string, data: Training}>} A promise that resolves with a message and the deleted training relation.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
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



/**
 * Bans or unbans a user.
 * @param {number} id - The ID of the user.
 * @param {number} ban - The ban status value.
 * @returns {Promise<{message: string, data: User}>} A promise that resolves with a message and the updated user.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */

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


/**
 * Fetches the current machine ID.
 * @returns {Promise<{message: string, data: number}>} A promise that resolves with a message and the current machine ID.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
export const fetchCurrentMachine = async (): Promise<{
    message: string,
    data: number
  }> => {
  let response;
  try {
      response = await fetch(`${API_MACHINE_URL}/whoami`,{
      credentials: "include"
    })
  } catch { //Catching a disconnect / lack of connection. Assumes kiosk.
    return {
      message: "Failed to connect to python server, assume kiosk",
      data:-1}
  }

  if (response === undefined) {
    throw new Error("This should not be possible, response undefined.");
  }
  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const { message, data}: { message: string, data: number } = await response.json();

  return { message, data };
}


/**
 * Saves the current machine by its ID.
 * @param {number} machine_id - The machine ID to save.
 * @returns {Promise<{message: string, data: boolean}>} A promise that resolves with a message and a boolean indicating success.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
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




/**
 * Retrieves all machines with optional sorting, pagination, and search.
 * @param {SortType} sort - Sorting order, default "name_asc".
 * @param {number} page - Page number, default 1.
 * @param {number} limit - Number of machines per page, default 10.
 * @param {string} search - Search term, default empty string.
 * @returns {Promise<{message: string, data: Machine[]}>} A promise that resolves with a message and an array of machines.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
export const getAllMachines = async (
  sort: SortType = "name_asc",
  page: number = 1,
  limit: number = 10,
  search: string = "",
  type: string = "",

): Promise<{
  message: string;
  data: Machine[];
}> => {
  const response = await fetch(`${API_DB_URL}/machines?search=${search}&limit=${limit}&page=${page}&sort=${sort}&type=${type}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const { message }: { message: string } = await response.json();

    throw new Error(message);
  }

  const { message, data }: { message: string; data: Machine[] } =
    await response.json();


  return { message, data };
};

/**
 * Retrieves a machine by its ID.
 * @param {number} id - The ID of the machine.
 * @returns {Promise<{message: string, data: Machine}>} A promise that resolves with a message and the machine data.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
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


/**
 * Creates a new machine type.
 * @param {string} type - The machine type string.
 * @returns {Promise<{message: string, data: MachineType}>} A promise that resolves with a message and the created machine type.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
export const createMachineType = async (type: string): Promise<{
  message: string;
  data: MachineType
}> => {
  const response = await fetch(`${API_DB_URL}/machine-types`,{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      name: type
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

/**
 * Updates a machine type.
 * @param {string} type - The updated machine type string.
 * @returns {Promise<{message: string, data: MachineType}>} A promise that resolves with a message and the updated machine type.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
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


/**
 * Deletes a machine type by its ID.
 * @param {number} id - The ID of the machine type to delete.
 * @returns {Promise<{message: string, data: MachineType}>} A promise that resolves with a message and the deleted machine type.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
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


/**
 * Retrieves machine types with optional sorting, pagination, and search.
 * @param {SortType} sort - Sorting order, default "asc".
 * @param {number} page - Page number, default 1.
 * @param {number} limit - Number of machine types per page, default 10.
 * @param {string} search - Search term, default empty string.
 * @returns {Promise<{message: string, data: MachineType[]}>} A promise that resolves with a message and an array of machine types.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
export const getMachineTypes = async ( sort: SortType = "asc",
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



/**
 * Creates a new machine.
 * @param {string} name - The name of the machine.
 * @param {MachineType} type - The machine type object.
 * @param {number} rate - The hourly rate for the machine.
 * @returns {Promise<{message: string, data: Machine}>} A promise that resolves with a message and the created machine.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */

export const createMachine = async (name: string, type: MachineType, rate: number): Promise<{
  message: string;
  data: Machine
}> => {

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

/**
 * Deletes a machine by its ID.
 * @param {number} id - The ID of the machine to delete.
 * @returns {Promise<{message: string, data: Machine}>} A promise that resolves with a message and the deleted machine.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */

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

export const createUserBudgetCode = async (user_id: number, budget_code_id: number): Promise<boolean> => {

  const response = await fetch(`${API_DB_URL}/user-budgets`, {
    method: "POST",
    credentials: "include",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      userId: user_id,
      budgetCodeId: budget_code_id
    })});


  if (!response.ok) {
    const { message }: { message: string} = await response.json();
    throw new Error(message);
  } 

  return true;


}

/*
Financial statement API functions 
*/

/**
 * Retrieves all financial statements.
 * @returns {Promise<{message: string; data: financialStatement[]}>} A promise that resolves with a message and an array of financial statements.
 * @throws {Error} If the response is not ok, throws an error with the response message.
 */
export const getFinancialStatements = async (): Promise<{
  message: string;
  data: financialStatement[];
}> => {
  const response = await fetch(`${API_DB_URL}/fin-statements`, {
    credentials: "include",
  });

  if (!response.ok) {
    const { message }: { message: string } = await response.json();

    throw new Error(message);
  }

  const { message, data }: { message: string; data: financialStatement[] } =
    await response.json();

  return { message, data };
};