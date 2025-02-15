export const sendHello = async(
    name: string,
    email: string
) => {
    let response = await fetch(`http://localhost:3000/api/users`,{
        credentials: "include",
        method: "POST",
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            name: name, 
            email: email
        })
    }

    );
}