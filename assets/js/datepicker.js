// $(document).ready(function () {
//   $(".datepicker").datepicker({
//     format: "dd-mm-yyyy",
//     selectMonths: true, // Enable Month Selection
//     selectYears: 10, // Creates a dropdown of 10 years to control year
//     //firstDay: 0,
//     showMonthAfterYear: false,
//     i18n: {
//       months: [
//         "Januari",
//         "Februari",
//         "Maret",
//         "April",
//         "Mei",
//         "Juni",
//         "Juli",
//         "Agustus",
//         "September",
//         "Oktober",
//         "November",
//         "Desember",
//       ],
//       monthsShort: [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "Mei",
//         "Jun",
//         "Jul",
//         "Agu",
//         "Sep",
//         "Okt",
//         "Nov",
//         "Des",
//       ],
//       weekdays: ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
//       weekdaysShort: ["Aha", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
//       weekdaysAbbrev: ["A", "S", "S", "R", "K", "J", "S"],
//     },
//   });

// });
document.addEventListener("DOMContentLoaded", function () {
  var options = {
    autoClose: true,
    format: "dd-mm-yyyy",

    // setDefaultDate: true,
  };
  var elems = document.querySelectorAll(".datepicker");
  var instances = M.Datepicker.init(elems, options);
  var instance = instances[0];

  // set a date (BUG: it's not visible)
  instance.setDate(new Date());

  instance._finishSelection();
  instance.destroy();
});
