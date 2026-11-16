try{
    fetch("http://localhost:3000/users")
    .then(response => response.json())
    .then(data.map() =>
        console.log(data[0].name)
    //     user => {
    //     const userRow = 
    //     `<tr>
    //         <td>${user.name}</td>
    //         <td></td>
    //         <td></td>
    //         <td></td>
    //         <td></td>
    //     </tr>`.join('')
    // }
)
}
catch{
    console.log("error")
}

