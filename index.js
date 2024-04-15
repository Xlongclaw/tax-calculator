/**
 * Income threshold for applying tax percentages.
 * If the overall income is greater than or equal to this boundary, taxes may apply based on the age group.
 * @constant {number}
 */
const TAX_BOUNDARY = 800000;

/**
 * Array of tax percentages and their respective age limits.
 * Each object contains an `ageLimit` and a `taxPercentage`.
 * @constant {Array<{ ageLimit: number, taxPercentage: number }>}
 */
const TAX_PERCENTAGES_FOR_AGE_GROUP = [
  {
    ageLimit: 40, // Age limit for the first tax bracket
    taxPercentage: 30, // Tax percentage for this age bracket
  },
  {
    ageLimit: 60, // Age limit for the second tax bracket
    taxPercentage: 40, // Tax percentage for this age bracket
  },
  {
    ageLimit: 100, // Age limit for the third tax bracket
    taxPercentage: 10, // Tax percentage for this age bracket
  },
];

/**
 * Initializes the tooltip functionality and sets up event handlers.
 * This function runs when the document is ready (i.e., when the DOM is fully loaded).
 */
$(document).ready(function () {

  // Initialize tooltips for elements with the data-bs-toggle attribute set to "tooltip"
  var tooltipTriggerList = [].slice.call($('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  /**
   * Event handler for the close button in the output container.
   * Hides the output container and prevents pointer events.
   * @param {Event} e - The event object triggered by the click event.
   */
  $("#output-container-close-btn").click(function (e) {
    e.preventDefault();

    // Hide the output container and disable pointer events
    $("#output-container").css({ "pointer-events": "none", opacity: "0" });

    // Show the submit button and enable pointer events
    $("#tax-form-submit-btn").css({ "pointer-events": "all", opacity: "1" });
  });

  /**
   * Event handler for the submit button in the tax form.
   * Collects form data, calculates final income, and updates the output container with the final income.
   * @param {Event} e - The event object triggered by the click event.
   */
  $("#tax-form-submit-btn").click(function (e) {
    e.preventDefault();

    // Retrieve form data from the tax form
    const formData = getFormData("#tax-form");

    // Validate the form data
    const validationResult = validateForm(formData);

    if (validationResult === "VALID") {
      // Calculate the final income based on the form data
      const finalIncome = calculateIncome(formData);

      // Update the displayed final income in the output container
      $("#final-income").empty();
      $("#final-income").text(finalIncome.toLocaleString("en-IN"));

      // Show the output container and enable pointer events
      $("#output-container").css({ "pointer-events": "all", opacity: "1" });

      // Hide the submit button and disable pointer events
      $("#tax-form-submit-btn").css({ "pointer-events": "none", opacity: "0" });
    }
  });
});

/**
 * Retrieves form data and converts it to a JavaScript object.
 * The data from the form is parsed and converted to numeric values.
 * @param {string} selector - The CSS selector for the form to retrieve data from.
 * @returns {Object} An object containing the form data as key-value pairs, with numeric values.
 */
const getFormData = (selector) => {
  var formObj = {};

  // Serialize the form data into an array of key-value pairs
  var data = $(selector).serializeArray();

  // Parse each field and convert to number if possible
  data.forEach((field) => {
    if (isNumeric(field.value)) {
      formObj[field.name] = Number(field.value);
    } else {
      formObj[field.name] = "INVALID";
    }
  });
  
  return formObj;
};

/**
 * Calculates the final income based on the form data provided.
 * If the overall income is above the TAX_BOUNDARY, the function calculates tax based on the age group.
 * @param {Object} data - An object containing the form data as key-value pairs.
 * @returns {number} The final income after applying taxes if necessary.
 */
const calculateIncome = (data) => {

  // Calculate the overall income by summing gross annual income and extra income, then subtracting deductions
  const overallIncome =
    data.grossAnnualIncome + data.extraIncome - data.totalApplicableDeductions;

  // Check if overall income meets or exceeds the tax boundary
  if (overallIncome >= TAX_BOUNDARY) {

    // Loop through each age group tax bracket
    for (let index = 0; index < TAX_PERCENTAGES_FOR_AGE_GROUP.length; index++) {

      // Check if the user's age group falls within the current tax bracket
      if (data.ageGroup < TAX_PERCENTAGES_FOR_AGE_GROUP[index].ageLimit) {

        // Calculate the tax based on the current bracket's tax percentage
        const tax =
          (overallIncome * TAX_PERCENTAGES_FOR_AGE_GROUP[index].taxPercentage) /
          100;

        // Calculate the final income by subtracting tax from overall income
        return overallIncome - tax;
      }
    }
  }

  // If overall income is below the tax boundary, return the overall income as is
  return overallIncome;
};

/**
 * Validates the form data.
 * Highlights invalid fields and returns the validation status.
 * @param {Object} formData - An object containing form data as key-value pairs.
 * @returns {string} "VALID" if all fields are valid, otherwise "INVALID".
 */
const validateForm = (formData) => {
  let invalidCount = 0;

  // Iterate through each field in the form data
  Object.entries(formData).forEach(([fieldName, fieldData]) => {

    // Check if the field value is invalid
    if (fieldData === "INVALID") {

      // Highlight invalid field by changing the text and border colors
      $(`.${fieldName}IC > span`).css({ color: "red" });
      $(`.${fieldName}IC`).css({ "border-color": "red" });
      invalidCount++;
    } else {
      
      // Reset the styles for valid fields
      $(`.${fieldName}IC > span`).css({ color: "#d3dbe3" });
      $(`.${fieldName}IC`).css({ "border-color": "#d3dbe3" });
    }
  });

  // Return the validation status
  return invalidCount === 0 ? "VALID" : "INVALID";
};

/**
 * Checks if the given value is a numeric string.
 * @param {string} str - The value to check.
 * @returns {boolean} True if the value is numeric, false otherwise.
 */
function isNumeric(str) {
  if (typeof str !== "string") return false; // Only allow strings
  return !isNaN(str) && !isNaN(parseFloat(str)); // Check if the value is numeric
}
