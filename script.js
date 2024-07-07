const resultElement = document.getElementById("result");
const lengthElement = document.getElementById("length");
const uppercaseElement = document.getElementById("uppercase");
const lowercaseElement = document.getElementById("lowercase");
const numbersElement = document.getElementById("numbers");
const symbolsElement = document.getElementById("symbols");
const generateElement = document.getElementById("generate");
const clipboardElement = document.getElementById("clipboard");
const strengthElement = document.getElementById("strength");
const excludeSimilarElement = document.getElementById("excludeSimilar");
const lengthDisplayElement = document.getElementById("lengthDisplay");

// Random functions
const getRandomLower = () =>
  String.fromCharCode(Math.floor(Math.random() * 26) + 97);

const getRandomUpper = () =>
  String.fromCharCode(Math.floor(Math.random() * 26) + 65);

const getRandomNumber = () =>
  String.fromCharCode(Math.floor(Math.random() * 10) + 48);

const getRandomSymbol = () => {
  const symbols = "!@#$%^&*(){}[]=<>/,.";
  return symbols[Math.floor(Math.random() * symbols.length)];
};

const randomFunctions = {
  lower: getRandomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol,
};

// Create a notification
const createNotification = (message) => {
  const notif = document.createElement("div");
  notif.classList.add("toast");
  notif.innerText = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
};

// Copy password to clipboard
clipboardElement.addEventListener("click", () => {
  const password = resultElement.innerText;
  if (!password) return;
  const textarea = document.createElement("textarea");
  textarea.value = password;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  createNotification("Password copied to clipboard!");
});

// Generate password
generateElement.addEventListener("click", () => {
  const length = +lengthElement.value;
  const hasLower = lowercaseElement.checked;
  const hasUpper = uppercaseElement.checked;
  const hasNumber = numbersElement.checked;
  const hasSymbol = symbolsElement.checked;
  const excludeSimilar = excludeSimilarElement.checked;
  resultElement.innerText = generatePassword(
    hasLower,
    hasUpper,
    hasNumber,
    hasSymbol,
    length,
    excludeSimilar
  );
  updateStrengthIndicator(resultElement.innerText);
});

// Generate password function
const generatePassword = (lower, upper, number, symbol, length, excludeSimilar) => {
  let generatedPassword = "";
  const typesCount = lower + upper + number + symbol;
  const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
    (item) => Object.values(item)[0]
  );

  if (typesCount === 0) return "";

  const similarCharacters = "il1Lo0O";
  const filterSimilar = (char) => !similarCharacters.includes(char);

  for (let i = 0; i < length; i += typesCount) {
    typesArr.forEach((type) => {
      let funcName = Object.keys(type)[0];
      let char;
      do {
        char = randomFunctions[funcName]();
      } while (excludeSimilar && !filterSimilar(char));
      generatedPassword += char;
    });
  }

  const finalPassword = generatedPassword.slice(0, length);
  return finalPassword;
};

// Update password strength indicator
const updateStrengthIndicator = (password) => {
  let strength = "Weak";
  if (password.length >= 12 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    strength = "Very Strong";
  } else if (password.length >= 10 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
    strength = "Strong";
  } else if (password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password)) {
    strength = "Moderate";
  }
  strengthElement.innerText = `Strength: ${strength}`;
};

// Update password length display
lengthElement.addEventListener("input", () => {
  lengthDisplayElement.innerText = lengthElement.value;
});

// Dark mode toggle
//darkModeToggleElement.addEventListener("click", () => {
  //document.body.classList.toggle("dark-mode");
  //createNotification("Dark mode toggled!");
//});

// Initialize length display
lengthDisplayElement.innerText = lengthElement.value;
