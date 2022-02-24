const API =
  "https://script.google.com/macros/s/AKfycbxXBsIFzl0JeHZF84rqlOx1nz6M9x4ke5BzeRMCue8tpKqsrh2l1P4JtifhSB7z3vbI/exec";
let fileData = {};
let form = null;
let fileInputs = [];

// add event listener to form and file inputs in the form
window.onload = function () {
  form = document.forms[0];
  form.addEventListener("submit", submit);

  const files = [...form.querySelectorAll("input[type='file']")];
  files.forEach((fileInput) =>
    fileInput.addEventListener("change", onFileChange)
  );
};

function showMessage(message, color = "black") {
  const messageElement = document.getElementById("message");
  messageElement.innerHTML = `<span style="color:${color};">${message}</span>`;
}

// form submit function
async function submit(e) {
  showMessage("Submitting");
  e.preventDefault();
  const formData = new FormData(form);
  const payload = {};
  for (let [key, value] of formData.entries()) {
    if (key in fileData) {
      payload[key] = fileData[key];
    } else if (typeof value === "object") {
      if (value.name === "") {
        payload[key] = "";
      } else {
        payload[key] = value;
      }
    } else {
      payload[key] = value;
    }
  }
  try {
    const options = {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const response = await fetch(API, options);
    window.location.replace("/message.html");
  } catch (error) {
    // handle failed form submission
    console.log(error);
    showMessage(error.message, "red");
  }
}

// handle file input
function onFileChange(e) {
  const id = e.target.id;
  const file = e.target.files[0];
  if (!file) {
    if (id in fileData) delete fileData[id];
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", function () {
    fileData[id] = {
      data: reader.result,
      name: file.name,
      type: file.type,
      size: file.size,
    };
  });
  reader.readAsDataURL(file);
}
