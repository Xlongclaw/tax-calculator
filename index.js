$(document).ready(function () {
  $("#output-container-close-btn").click(function (e) {
    e.preventDefault();
    console.log("CLICKED");
    $("#output-container").css({ "pointer-events": "none", opacity: "0" });
  });

  $("#tax-form-submit-btn").click(function (e) {
    e.preventDefault();
    $("#output-container").css({ "pointer-events": "all", opacity: "1" });
    const formData = getFormData("#tax-form");
    const finalIncome = calculateIncome(formData)
    $("#final-income").empty();
    $("#final-income").append(finalIncome.toLocaleString('en-IN'));;
  });
});

const getFormData = (selector) => {
  var formObj = {};
  var data = $(selector).serializeArray();
  data.forEach((field) => {
    formObj[field.name] = Number(field.value);
  });
  console.log(formObj);
  return formObj;
};

const calculateIncome = (data) => {
  const TAX_BOUNDARY = 800000;
  const TAX_PERCENTAGES_FOR_AGE_GROUP = [
    {
      fromAge: 0,
      toAge: 40,
      taxPercentage: 30,
    },
    {
      fromAge: 40,
      toAge: 60,
      taxPercentage: 40,
    },
    {
      fromAge: 60,
      toAge: 100,
      taxPercentage: 10,
    },
  ];

  var finalIncome = 0;
  var overallIncome =
    data.grossAnnualIncome + data.extraIncome - data.totalApplicableDeductions;
  if (overallIncome >= TAX_BOUNDARY) {
    for (let index = 0; index < TAX_PERCENTAGES_FOR_AGE_GROUP.length; index++) {
      if (data.ageGroup < TAX_PERCENTAGES_FOR_AGE_GROUP[index].toAge) {
        let tax =
          (overallIncome * TAX_PERCENTAGES_FOR_AGE_GROUP[index].taxPercentage) /
          100;
        finalIncome = overallIncome - tax;

        break;
      }
    }
    return finalIncome;
  } else {
    return overallIncome;
  }
};
