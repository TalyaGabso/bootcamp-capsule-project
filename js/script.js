//--------Create Elements--------//
//search bar
const searchBar = document.querySelector("#search-bar");
const inputSearch = document.querySelector(".input-search");
const categoryDropdown = document.querySelector(".dropdown");

// table
const table = document.querySelector(".table");
const tableBody = document.querySelector(".table-body");
const sortBar=document.querySelector('tr')

//buttons in td (dynamic)
const cancelBtn = document.querySelector(".btn-delete_cancel");
const saveBtn = document.querySelector(".btn-edit_save");

//temp container for table event listener
let currentDataRow = [];
//temp container of dropdown obj value for search bar event listener
let searchCategory = "";
const dropdownValues = {
	byFirst: 1,
	byLast: 2,
	byCapsule: 3,
	byAge: 4,
	byCity: 5,
	byGender: 6,
	byHobby: 7,
};
// 
let allStudents = [];

// api url
const studentsBasePoint = "https://appleseed-wa.herokuapp.com/api/users/";
//fetch api data
async function allData() {
	const response = await fetch(studentsBasePoint);
	const data = await response.json();
	for (let i = 0; i < data.length; i++) {
		const student = `${studentsBasePoint}/${data[i].id}`;
		const stuResponse = await fetch(student);
		const stuData = await stuResponse.json();
		allStudents.push(meargeStudentData(data[i], stuData));
	}
	printTableBody(allStudents);
}
//mearge students data
function meargeStudentData(students, student) {
	return {
		id: students.id,
		firstName: students.firstName,
		lastName: students.lastName,
		capsule: students.capsule,
		age: student.age,
		city: student.city,
		gender: student.gender.toUpperCase(),
		hobby: student.hobby,
	};
}
// create table content
function printTableBody(students) {
	students.forEach((row) => {
		const newRow=document.createElement("tr")
    newRow.innerHTML = `<td>${row.id}</td>
        <td class='editable'>${row.firstName}</td>
        <td class='editable'>${row.lastName}</td>
        <td class='editable'>${row.capsule}</td>
        <td class='editable'>${row.age}</td>
        <td class='editable'>${row.city}</td>
        <td class='editable'>${row.gender}</td>
        <td class='editable'>${row.hobby}</td>
        <td class="btn-edit_save"><i class="fas fa-edit edit"></i></td>
        <td class="btn-delete_cancel"><i class="fas fa-trash-alt delete"></i></td>`;
		tableBody.appendChild(newRow);
	});
}


//------------------event listener functions------------------//
//delete student

function deleteStudent(tragetBin) {
	tragetBin.closest("tr").remove();
}

//edit student
function editStudent(tragetEdit) {
	//currenDataRow is empty
	currentDataRow = [];
	const saveBtn = tragetEdit.parentElement;
	const cancelBtn = saveBtn.nextElementSibling;
	// editContent is a node list array of all the elements in th row that contains class editable
	const editContent = tragetEdit.parentElement.parentElement.querySelectorAll(
		".editable"
	);
	editContent.forEach((cell, index) => {
		// currentDataRow gets each cell inner html
		currentDataRow.push(cell.textContent);
		cell.innerHTML = `<input class='onEdit' type="text" value="${currentDataRow[index]}">`;
	});
	saveBtn.innerHTML = `<i class="fas fa-check confirm"></i>`;
	cancelBtn.innerHTML = `<i class="fas fa-times cancel"></i>`;
}

// confirm edit
function confirmEdit(tragetEdit) {
	const editBtn = tragetEdit.parentElement;
	const deletelBtn = editBtn.nextElementSibling;
	const confirmContent = tragetEdit.parentElement.parentElement.querySelectorAll(
		".editable"
	);
	confirmContent.forEach((cell) => {
		cell.textContent = cell.querySelector(".onEdit").value;
	});
	editBtn.innerHTML = `<i class="fas fa-edit edit"></i>`;
	deletelBtn.innerHTML = `<i class="fas fa-trash-alt delete"></i>`;
}

// cancel edit
function cancelEdit(tragetEdit) {
	const deleteBtn = tragetEdit.parentElement;
	const editBtn = deleteBtn.previousElementSibling;

	const cancelContent = tragetEdit.parentElement.parentElement.querySelectorAll(
		".editable"
	);
	cancelContent.forEach((cell, index) => {
		cell.textContent = currentDataRow[index];
	});
	editBtn.innerHTML = `<i class="fas fa-edit edit"></i>`;
	deleteBtn.innerHTML = `<i class="fas fa-trash-alt delete"></i>`;
}

//--------------------Events Listener----------------------//
//SEARCH BAR
//dropdown
categoryDropdown.addEventListener("change", (opt) => {
	searchCategory = dropdownValues[opt.target.value];
	// search input
	inputSearch.addEventListener("input", (e) => {
		const input = e.target.value;
		const filter = input.toUpperCase();
		const tr = tableBody.querySelectorAll("tr");

		tr.forEach((row, index) => {
			const td = row.querySelectorAll(".editable")[
				parseInt(searchCategory) - 1
			];
			if (td) {
				const txtValue = td.textContent.toUpperCase();
				if (txtValue.indexOf(filter) > -1) {
					tr[index].style.display = "";
				} else {
					tr[index].style.display = "none";
				}
			}
		});
	});
});
// SORT BY

//TABLE body event: delete, edit,confirm,cancel
tableBody.addEventListener("click", (e) => {
	if (e.target.classList.contains("delete")) {
		deleteStudent(e.target);
	} else if (e.target.classList.contains("edit")) {
		editStudent(e.target);
	} else if (e.target.classList.contains("confirm")) {
		confirmEdit(e.target);
	} else if (e.target.classList.contains("cancel")) {
		cancelEdit(e.target);
	}
});

allData();
