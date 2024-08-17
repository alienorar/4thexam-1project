
const add_student = document.getElementById("add-student")
const student_model = document.getElementById("student-modal")
const save_btn = document.getElementById("save")
const cancel_btn = document.getElementById("cancel")
const result = document.getElementById("result")
let base_url = "http://localhost:3000/students?"
let form = {}
let students_list = []
let edit_student = -1
let obj = {}
let search = ""
let page = 1
document.addEventListener("DOMContentLoaded", function () {
    add_student.addEventListener("click", openModal)
    save_btn.addEventListener("click", saveStudent)
    getStudent()
    document.getElementById("prev").addEventListener("click", function () {
        if (page !== 1) {
            page--
            getStudent()
            displayStudents()
            console.log(page);

        }

    })
    document.getElementById("next").addEventListener("click", function () {
        page++
        getStudent()
        displayStudents()
        console.log(page);
    })



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
    if (+edit_student > -1) {
        try {
            const response = await fetch(`${base_url}${edit_student}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)


            })

        } catch (error) {

        }
    }
    else {
        try {
            const response = await fetch(`${base_url}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)

            })
            // console.log(response);
        } catch (error) {
            console.log(error);

        }
    }

}

async function getStudent() {
    try {
        const response = await fetch(`${base_url}_page=${page}&_limit=2`)
        // console.log(response);
        students_list = await response.json()
        displayStudents()
    } catch (error) {
        console.log(error);

    }
    displayStudents()

}
function searchStudents(event) {
    search = event.target.value
    displayStudents()
}

function displayStudents() {
    result.innerHTML = ""
    let filtered_students = students_list?.filter(item => {
        if (item?.first_name?.includes(search)) {
            return item
        }
    });

    students_list.forEach((item, index) => {
        let tr = document.createElement('tr')
        tr.innerHTML = `<td>${index + 1}</td>
        <td>${item.first_name}</td>
        <td>${item.last_name}</td>
        <td>${item.email}</td>
        <td>${item.phone_number}</td>
        <td>${item.date}</td>
        <td><button class="bg-transparent border-0" onclick="editStudent('${item.id}')"><i class="fa-solid fa-pencil" style="color: #FFD43B;"></i></button>
        <button  class="bg-transparent border-0" onclick="deleteStudent('${item.id}')"><i class="fa-solid fa-trash" style="color: #FFD43B;"></i></button></td>`

        result.appendChild(tr)
    });
}

async function deleteStudent(id) {

    try {
        await fetch(`${base_url}/${id}`, {
            method: "DELETE"
        })
        console.log(id);


    } catch (error) {
        console.log(error);

    }
}

async function editStudent(id) {
    edit_student = id
    form = students_list.find((item) => item.id === id)
    document.querySelector("input[name='first_name']").value = form.first_name;
    document.querySelector("input[name='last_name']").value = form.last_name;
    document.querySelector("input[name='email']").value = form.email;
    document.querySelector("input[name='phone_number']").value =
        form.phone_number;
    document.querySelector("input[name='date']").value = form.date;
    document.querySelector("input[name='id']").value = form.id;

    console.log(form);

    toggleModal("block");

}

cancel_btn.addEventListener("click", () => {
    toggleModal("none")
})

function openModal() {
    toggleModal("block")

}

function closeModal() {
    toggleModal("none")
}

