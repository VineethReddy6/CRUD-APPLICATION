 function getStudents() {
    let response = await fetch("http://localhost:4000/stu");
    console.log(response);
    let result =  response.json();
    console.log(result);
}