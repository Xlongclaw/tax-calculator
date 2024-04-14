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
 * Runs when the document is ready (i.e., when the DOM is fully loaded).
 */
$(document).ready(function () {

  /**
   * Event handler for the close button in the output container.
   * Hides the output container and prevents pointer events.
   * @param {Event} e - The event object triggered by the click event.
   */
  $("#output-container-close-btn").click(function (e) {
    e.preventDefault();

    // Hide the output container and disable pointer events
    $("#output-container").css({ "pointer-events": "none", opacity: "0" });
    
    // Show the submit button and disable pointer events
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

    // Calculate the final income based on the form data
    const finalIncome = calculateIncome(formData);

    // Update the displayed final income in the output container
    $("#final-income").empty();
    $("#final-income").append(finalIncome.toLocaleString("en-IN"));

    // Show the output container and enable pointer events
    $("#output-container").css({ "pointer-events": "all", opacity: "1" });

    // Hide the submit button and enable pointer events
    $("#tax-form-submit-btn").css({ "pointer-events": "none", opacity: "0" });
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

  data.forEach((field) => {
    formObj[field.name] = Number(field.value);
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
  var finalIncome = 0;

  // Calculate the overall income by summing gross annual income and extra income, then subtracting deductions
  var overallIncome = data.grossAnnualIncome + data.extraIncome - data.totalApplicableDeductions;

  // Check if overall income meets or exceeds the tax boundary
  if (overallIncome >= TAX_BOUNDARY) {

    // Loop through each age group tax bracket
    for (let index = 0; index < TAX_PERCENTAGES_FOR_AGE_GROUP.length; index++) {

      // Check if the user's age group falls within the current tax bracket
      if (data.ageGroup < TAX_PERCENTAGES_FOR_AGE_GROUP[index].ageLimit) {

        // Calculate the tax based on the current bracket's tax percentage
        let tax = (overallIncome * TAX_PERCENTAGES_FOR_AGE_GROUP[index].taxPercentage) / 100;

        // Subtract the calculated tax from the overall income to get the final income
        finalIncome = overallIncome - tax;
        break; // Exit the loop once a matching age bracket is found
      }
    }
    return finalIncome; // Return the calculated final income
  } else {
    // If overall income is below the tax boundary, return the overall income as it is.
    return overallIncome;
  }
};
