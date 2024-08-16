
const add_student = document.getElementById("add-student")
const student_model = document.getElementById("student-modal")
const save_btn = document.getElementById("save")
const cancel_btn = document.getElementById("cancel")
const result = document.getElementById("result")
let base_url = "http://localhost:3000/students"
let form = {}
let students_list = []
document.addEventListener("DOMContentLoaded", function () {
    add_student.addEventListener("click", openModal)
    save_btn.addEventListener("click", saveStudent)
    getStudent()
})
window.addEventListener("click", (event) => {
    if (event.target === student_model) {
        saveStudent()
        toggleModal("none")
    }
})



function toggleModal(status) {
    student_model.style.display = status
}

function handleChange(event) {
    const { name, value } = event.target
    form = { ...form, [name]: value }

}
async function saveStudent() {
    try {
        const response = await fetch(`${base_url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)


        })
        console.log(response);
    } catch (error) {
        console.log(error);

    }
}

async function getStudent() {
    try {
        const response = await fetch(`${base_url}`)
        students_list = await response.json()
    } catch (error) {
        console.log(error);

    }
    displayStudents()
}
function searchStudents(event) {
    students_list.forEach(item => {
        if (item.first_name.includes(event.target.value)) {
            console.log(item);

        }

    });
}

function displayStudents() {
    result.innerHTML = ""
    students_list.forEach((item, index) => {
        let tr = document.createElement('tr')
        tr.innerHTML = `<td>${index + 1}</td>
        <td>${item.first_name}</td>
        <td>${item.last_name}</td>
        <td>${item.email}</td>
        <td>${item.phone_number}</td>
        <td>${item.date}</td>
        <td><button class="bg-transparent border-0" onclick="editUser('${item.id}')"><i class="fa-solid fa-pencil" style="color: #FFD43B;"></i></button>
        <button  class="bg-transparent border-0" onclick="deleteUser('${item.id}')"><i class="fa-solid fa-trash" style="color: #FFD43B;"></i></button></td>`

        result.appendChild(tr)
    });
}

async function deleteUser(id) {

    try {
        await fetch(`${base_url}/${id}`, {
            method: "DELETE"
        })
        console.log(id);


    } catch (error) {
        console.log(error);

    }
}



function openModal() {
    toggleModal("block")

}

function closeModal() {
    toggleModal("none")
}