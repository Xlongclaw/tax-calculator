$(document).ready(function () {
  $("#output-container-close-btn").click(function (e) {
    e.preventDefault();
    console.log("CLICKED");
    $("#output-container").hide();
  });
});
