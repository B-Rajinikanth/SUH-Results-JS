const fullDB = [];
const subjectsList = {
	C24MAT103: "Maths",
	C24ENG104: "C Programming",
	C24CSE102: "Data Structures",
}

const resultDisplay = document.getElementById('resultDisplay')
const withheldBox = document.getElementById('withheldBox')
const tableHeader = document.getElementById('tableHeader')

const loadExcel = () => {
	fetch("Result_Supply.xlsx")
		.then((res) => res.arrayBuffer())
		.then((buffer) => {
			const workbook = XLSX.read(buffer, { type: "array" });
			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

			const headers = rawData[0];
			const subHeaders = rawData[1];
			const rows = rawData.slice(2);

			// console.log(headers)

			rows.forEach((row) => {
				const student = {
					urn: row[1] ? row[1].toString().trim() : "",
					name: row[2] ? row[2].toString().trim() : "",
					courses: [],
				};

				for (let i = 3; i < headers.length; i++) {
					const courseCode = headers[i];
					if (!courseCode || courseCode === "") continue;
				
					const normalizedCode = courseCode.trim().toUpperCase();
				
					if (normalizedCode === "SGPA") {
						student.sgpa = row[i];
						continue;
					}
					if (normalizedCode === "CGPA") {
						student.cgpa = row[i];
						continue;
					}
				
						const course = {
							courseCode: normalizedCode,
							result: row[i],
							grade: row[i + 1],
							credits: parseFloat(row[i + 2]),
							courseTitle: row[i + 3],
						};
						student.courses.push(course);
						i += 3; // skip next 3 columns (grade, credits, points)
					
				}
				fullDB.push(student);
			});

			// console.log(fullDB);
		});
};

const getResult = () => {
	const urn = document.getElementById("urn").value.trim().toUpperCase();

	if (!urn) {
		alert("Please enter a valid URN.");
		return;
	}

	const studentResult = fullDB.find((student) => student.urn === urn);


	// ✅ Clear previous results
	const tbody = document.getElementById("courses-table").querySelector("tbody");

	resultDisplay.classList.remove('hidden')

	if (!studentResult) {
		document.getElementById("errorMessage").innerHTML = `If your result is not displayed, please contact the <span class="font-bold underline italic">University Office</span>.`;
		tbody.innerHTML = "";
		document.getElementById("urnRes").innerHTML = "";
		document.getElementById("nameRes").innerHTML = "";
		document.getElementById("deptRes").innerHTML = "";
		document.getElementById("sorRes").innerHTML = "";
		document.getElementById('program').innerHTML = "";
		document.getElementById("resBox").classList.add('hidden')
		withheldBox.classList.add('hidden')
		tableHeader.classList.add('hidden')
	} else {
		document.getElementById("errorMessage").innerHTML = "";
		document.getElementById("urnRes").innerHTML = `Register Number: <span class="font-semibold"> ${studentResult.urn} </span>`;
		document.getElementById("nameRes").innerHTML = `Student Name: <span class="font-semibold"> ${studentResult.name} </span>`;

		let dept = studentResult.urn.includes("CSEAI") ? "CSE (AIML)" : "CSE";
		document.getElementById("deptRes").innerHTML = `Department: <span class="font-semibold"> ${dept} </span>`;
		document.getElementById("sorRes").innerHTML = `Semester: <span class="font-semibold">II</span>`;

		document.getElementById('program').innerHTML = `Program: <span class="font-semibold">B.Tech</span>`

		tbody.innerHTML = "";


		withheldBox.classList.remove('hidden')
		tableHeader.classList.remove('hidden')


		// ✅ Fill in new rows
		studentResult.courses.forEach(course => {
			const subjectCode = "C" + course.courseCode;
			if (course.result !== undefined) {
				const row = document.createElement("tr");
				row.innerHTML = `
					<td class="border-gray-200 bg-cyan-50 border-b-1 p-2 text-center">${course.courseCode}</td>
					<td class="border-gray-200 bg-cyan-50 border-b-1 p-2">${course.courseTitle}</td>
					<td class="border-gray-200 bg-cyan-50 border-b-1 p-2 text-center">${course.grade}</td>
					<td class="border-gray-200 bg-cyan-50 border-b-1 p-2 text-center">${course.result}</td>
					<td class="border-gray-200 bg-cyan-50 border-b-1 p-2 text-center">${course.credits}</td>
				`;
				tbody.appendChild(row);
			}
		});

		const sgpaRow = document.createElement("tr");
		sgpaRow.innerHTML = `
			<td colspan="5" class="font-bold text-blue-800 bg-green-100 border-gray-200 border-b-1 p-2 text-center">
				SGPA: ${studentResult.sgpa}
			</td>
		`;
		tbody.appendChild(sgpaRow);
		// const cgpaRow = document.createElement("tr");
		// cgpaRow.innerHTML = `
		// 	<td colspan="5" class="font-bold text-blue-800 bg-green-100 border-gray-200 border-b-1 p-2 text-center">
		// 		CGPA: ${studentResult.cgpa}
		// 	</td>
		// `;
		// tbody.appendChild(cgpaRow);
	}
};


loadExcel();
