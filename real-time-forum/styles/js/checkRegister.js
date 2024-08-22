export async function CheckRegister() {
  console.log("SLT");

  // Getting input elements
  const inputPseudo = document.getElementById("pseudo_searchbar");
  const inputPrenom = document.getElementById("FirstName_searchbar");
  const inputNom = document.getElementById("name_searchbar");
  const inputEmail = document.getElementById("mail");
  const inputAge = document.getElementById("age");
  const inputGender = document.getElementById("gender");
  const inputPassword = document.getElementById("password");
  const inputConfirmPassword = document.getElementById("password_confirmation");
  const errorMessage = document.getElementById("error_message");

  // Getting input values
  const inputPseudoValue = inputPseudo.value || "";
  const inputPrenomValue = inputPrenom.value || "";
  const inputNomValue = inputNom.value || "";
  const inputEmailValue = inputEmail.value || "";
  const inputAgeValue = inputAge.value || "";
  const inputGenderValue = inputGender.value || "";
  const inputPasswordValue = inputPassword.value || "";
  const inputConfirmPasswordValue = inputConfirmPassword.value || "";

  let genderStr = "";
  // Validating gender input
  if (inputGenderValue !== "") {
    let tiltedGender = ToTitle(inputGenderValue);
    console.log(inputGenderValue);
    if (tiltedGender === "Homme" || tiltedGender === "Femme") {
      genderStr = tiltedGender;
      console.log("Bienvenue cher visiteur !!");
    } else {
      errorMessage.innerHTML = "ERROR dans le système, allez consulter svp";
      console.log("ERROR dans le système, allez consulter svp");
      return;
    }
  }

  // // Validating age input
  // if (inputAgeValue <= 0 || inputAgeValue > 110) {
  //   errorMessage.innerHTML = "Problem with age";
  //   console.log("Il y a un problème vis à vis de l'âge !");
  //   return;
  // }

  // Preparing data to be sent
  let dataRegister = {
    username: ToTitle(inputPseudoValue),
    first_name: ToTitle(inputPrenomValue),
    last_name: ToTitle(inputNomValue),
    email: inputEmailValue,
    age: inputAgeValue.toString(),
    gender: genderStr,
    password: inputPasswordValue,
    confirmPassword: inputConfirmPasswordValue,
  };

  if (
    dataRegister.username === "" ||
    dataRegister.first_name === "" ||
    dataRegister.last_name === "" ||
    dataRegister.email === "" ||
    dataRegister.age === "" ||
    dataRegister.gender === "" ||
    dataRegister.password === "" ||
    dataRegister.confirmPassword === ""
  ) {
    errorMessage.innerHTML = "Missing informations";
    console.log("Il manque des informations !");
    return;
  }
  if (dataRegister.age <= 0 || dataRegister.age > 110) {
    errorMessage.innerHTML = "Problem with age";
    return;
  }
  if (dataRegister.password !== dataRegister.confirmPassword) {
    errorMessage.innerHTML = "Wrong password verification";
    console.log("Pas les mêmes password !!");
    return;
  }

  console.log(dataRegister);
  console.log("Hello");

  // Sending data to the server
  fetch("http://localhost:8003/registerData", {
    method: "POST",
    body: JSON.stringify(dataRegister),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Data received:", data);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

export function ToTitle(string) {
  if (string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }
}
