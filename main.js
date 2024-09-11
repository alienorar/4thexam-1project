const add_student = document.getElementById("add-student")
const student_modal = document.getElementById("student-modal")
const save_btn = document.getElementById("save")
const cancel_btn = document.getElementById("cancel")
const result = document.getElementById("result")
let base_url = "http://localhost:3000/students"
let form = {}
let students_list = []
let edit_student = -1
let search = ""
let page = 1
let limit = 4

document.addEventListener("DOMContentLoaded", function () {
    add_student.addEventListener("click", openModal)
    save_btn.addEventListener("click", saveStudent)
    getStudent()

    document.getElementById("next").addEventListener("click", () => {
        page++;
        getStudent()
    })

    document.getElementById("prev").addEventListener("click", () => {
        if (page > 1) {
            page--;
            getStudent()
        }
    })
})

window.addEventListener("click", (event) => {
    if (event.target === student_modal) {
        closeModal() // Close modal if clicked outside the modal content
    }
})

function toggleModal(status) {
    student_modal.style.display = status
}

function handleChange(event) {
    const { name, value } = event.target
    form = { ...form, [name]: value }
}

async function saveStudent() {
    try {
        const method = (edit_student === -1) ? "POST" : "PATCH";
        const url = (edit_student === -1) ? `${base_url}` : `${base_url}/${edit_student}`;

        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        // Reset after saving
        form = {}
        edit_student = -1;
        closeModal();
        getStudent();
    } catch (error) {
        console.log(error);
    }
}

async function getStudent() {
    try {
        const response = await fetch(`${base_url}?_page=${page}&_limit=${limit}`)
        students_list = await response.json()
        displayStudents()
    } catch (error) {
        console.log(error);
    }
}

function searchStudents(event) {
    search = event.target.value
    displayStudents()
}

function displayStudents() {
    result.innerHTML = ""

    // Apply search filter
    let filtered_students = students_list.filter(item => item?.first_name?.toLowerCase().includes(search.toLowerCase()));

    filtered_students.forEach((item, index) => {
        let tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.first_name}</td>
            <td>${item.last_name}</td>
            <td>${item.email}</td>
            <td>${item.phone_number}</td>
            <td>${item.date}</td>
            <td>
                <button class="bg-transparent border-0" onclick="editStudent('${item.id}')">
                    <i class="fa-solid fa-pencil" style="color: #FFD43B;"></i>
                </button>
                <button class="bg-transparent border-0" onclick="deleteStudent('${item.id}')">
                    <i class="fa-solid fa-trash" style="color: #FFD43B;"></i>
                </button>
            </td>`
        result.appendChild(tr)
    });
}

async function deleteStudent(id) {
    try {
        await fetch(`${base_url}/${id}`, {
            method: "DELETE"
        });
        getStudent();  // Refresh the student list after deletion
    } catch (error) {
        console.log(error);
    }
}

async function editStudent(id) {
    edit_student = id
    form = students_list.find((item) => item.id === id)

    // Populate form fields with existing data
    document.querySelector("input[name='first_name']").value = form.first_name;
    document.querySelector("input[name='last_name']").value = form.last_name;
    document.querySelector("input[name='email']").value = form.email;
    document.querySelector("input[name='phone_number']").value = form.phone_number;
    document.querySelector("input[name='date']").value = form.date;

    toggleModal("block");
}

cancel_btn.addEventListener("click", closeModal)

function openModal() {
    form = {}
    edit_student = -1;  // Reset edit_student when adding a new student
    toggleModal("block")
}

function closeModal() {
    toggleModal("none")
    resetForm();  // Reset the form when the modal is closed
}

function resetForm() {
    document.querySelector("form").reset();
}
