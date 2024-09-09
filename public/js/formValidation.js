document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const firstName = document.getElementById("first-name");
  const lastName = document.getElementById("last-name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  const radioButtons = document.querySelectorAll("input[type='radio']");
  const consentCheck = document.getElementById("consent-check");
  const successMessage = document.querySelector(".success-message-container");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let hasError = false;
    let firstErrorElement = null;

    // Reset error messages and aria-invalid attributes
    form.querySelectorAll(".error").forEach((error) => {
      error.classList.add("hidden");
    });
    [firstName, lastName, email, message].forEach((input) => {
      input.setAttribute("aria-invalid", "false");
    });

    // First Name validation
    if (firstName.value.trim() === "") {
      showError(firstName, "This field is required");
      hasError = true;
      if (!firstErrorElement) firstErrorElement = firstName;
    }

    // Last Name validation
    if (lastName.value.trim() === "") {
      showError(lastName, "This field is required");
      hasError = true;
      if (!firstErrorElement) firstErrorElement = lastName;
    }

    // Email validation
    if (email.value.trim() === "") {
      showError(email, "This field is required");
      hasError = true;
      if (!firstErrorElement) firstErrorElement = email;
    } else if (!isValidEmail(email.value)) {
      showError(email, "Please enter a valid email address");
      hasError = true;
      if (!firstErrorElement) firstErrorElement = email;
    }

    // Message (textarea) validation
    if (message.value.trim() === "") {
      showError(message, "This field is required");
      hasError = true;
      if (!firstErrorElement) firstErrorElement = message;
    }

    // Radio button (query type) validation
    let querySelected = false;
    radioButtons.forEach((radio) => {
      if (radio.checked) querySelected = true;
    });
    if (!querySelected) {
      const radioError = document.querySelector("fieldset .error");
      if (radioError) {
        radioError.textContent = "Please select a query type";
        radioError.classList.remove("hidden");
      }
      hasError = true;
      if (!firstErrorElement) firstErrorElement = radioButtons[0];
    }

    // Checkbox validation
    if (!consentCheck.checked) {
      showErrorCheckbox(
        consentCheck,
        "To submit this form, please consent to being contacted"
      );
      hasError = true;
      if (!firstErrorElement) firstErrorElement = consentCheck;
    }

    // Prevent form submission if there's an error and focus on the first error
    if (hasError) {
      if (firstErrorElement) {
        firstErrorElement.focus(); // Focus on the first element with an error
      }
    } else {
      showToast();
      message.value = "";
    }
  });

  // Add event listeners to clear error messages on input
  [firstName, lastName, email, message].forEach((input) => {
    input.addEventListener("input", function () {
      clearError(input);
    });
  });

  // Add event listener for radio buttons to clear error on selection
  radioButtons.forEach((radio) => {
    radio.addEventListener("change", function () {
      clearErrorRadioGroup();
    });
  });

  // Add event listener for checkbox to clear error on check/uncheck
  consentCheck.addEventListener("change", function () {
    clearErrorCheckbox(consentCheck);
  });

  // Function to show error message for input fields
  function showError(inputElement, message) {
    const errorElement = inputElement.closest("div").querySelector(".error");
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove("hidden");
    }
    inputElement.setAttribute("aria-invalid", "true");
  }

  // Special function to handle checkbox error
  function showErrorCheckbox(checkboxElement, message) {
    const errorElement =
      checkboxElement.parentNode.parentNode.querySelector(".error");
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove("hidden");
    }
  }

  // Function to clear error message on valid input
  function clearError(inputElement) {
    const errorElement = inputElement.closest("div").querySelector(".error");
    if (errorElement) {
      errorElement.classList.add("hidden");
    }
    inputElement.setAttribute("aria-invalid", "false");
  }

  // Function to clear radio group error on selection
  function clearErrorRadioGroup() {
    const radioError = document.querySelector("fieldset .error");
    if (radioError) {
      radioError.classList.add("hidden");
    }
  }

  // Function to clear checkbox error
  function clearErrorCheckbox(checkboxElement) {
    const errorElement =
      checkboxElement.parentNode.parentNode.querySelector(".error");
    if (errorElement) {
      errorElement.classList.add("hidden");
    }
  }

  // Function to validate email address
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showToast() {
    if (successMessage) {
      successMessage.innerHTML = "";
      successMessage.innerHTML = `
        <div class="flex-group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="21"
            fill="none"
            viewBox="0 0 20 21"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill="#fff"
              d="M14.28 7.72a.748.748 0 0 1 0 1.06l-5.25 5.25a.748.748 0 0 1-1.06 0l-2.25-2.25a.75.75 0 1 1 1.06-1.06l1.72 1.72 4.72-4.72a.75.75 0 0 1 1.06 0Zm5.47 2.78A9.75 9.75 0 1 1 10 .75a9.76 9.76 0 0 1 9.75 9.75Zm-1.5 0A8.25 8.25 0 1 0 10 18.75a8.26 8.26 0 0 0 8.25-8.25Z"
            ></path>
          </svg>
          <p class="fw-bold fs-500 clr-neutral-100">Message Sent!</p>
        </div>
        <p class="success-message-text clr-primary-200">
          Thanks for completing the form. We’ll be in touch soon!
        </p>
      `;
      successMessage.classList.remove("hide");
      successMessage.classList.add("show");
    }

    setTimeout(() => {
      hideToast();
    }, 8000);
  }

  function hideToast() {
    if (successMessage) {
      successMessage.classList.remove("show");
      successMessage.classList.add("hide");
    }
  }
});
