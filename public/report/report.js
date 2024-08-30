var socket = io();

if (
  location.host.indexOf("localhost") < 0 &&
  location.protocol.toLowerCase() !== "https:"
) {
  const url = `https://${location.host}`;
  location.replace(url);
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

if (
  getCookie("auth") == "aries.powvalla@gmail.com" ||
  getCookie("auth") == "whitenj@gmail.com" ||
  getCookie("auth") == "pwhite@jesuitmail.org"
) {
} else {
  window.location.replace("/");
}

function activeUsers(users) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let n = users.filter((user) =>
    user.record.some(
      (activity) =>
        new Date(activity.end) > thirtyDaysAgo &&
        new Date(activity.start) < new Date(activity.end) &&
        new Date(activity.end) - new Date(activity.start) >= 1 * 60 * 60 * 1000
    )
  ).length;

  return n==0 ? "N/A" : n;
}

function retention(users) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activeUsers30DaysAgo = users.filter((user) =>
    user.record.some(
      (activity) =>
        new Date(activity.start) < thirtyDaysAgo &&
        new Date(activity.end) > thirtyDaysAgo &&
        new Date(activity.end) - new Date(activity.start) >= 6 * 60 * 60 * 1000
    )
  ).length;

  const currentActiveUsers = activeUsers(users);

  if (activeUsers30DaysAgo === 0) {
    return "N/A";
  }

  return (
    Math.round((currentActiveUsers / activeUsers30DaysAgo) * 10000) / 100 + "%"
  );
}

function formatDate1(dateStringa, dateStringb) {
  const date = new Date(dateStringa);
  const date2 = new Date(dateStringb);

  if (isNaN(date.getTime())) {
    return "Invalid Date 1";
  }

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours() % 12 || 12).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = date.getHours() < 12 ? "AM" : "PM";

  const hours2 = String(date2.getHours() % 12 || 12).padStart(2, "0");
  const minutes2 = String(date2.getMinutes()).padStart(2, "0");
  const period2 = date2.getHours() < 12 ? "AM" : "PM";

  if (isNaN(date2.getTime())) {
    return `<strong>${dayOfWeek} ${month}/${day}/${year} | ${hours}:${minutes} ${period} (SIGNED IN)</strong>`;
  }

  const formattedDate = `${dayOfWeek} ${month}/${day}/${year} | ${hours}:${minutes} ${period} > ${hours2}:${minutes2} ${period2}`;

  return formattedDate;
}

function isLoggedIn(arr) {
  if (arr === undefined || arr.length == 0) {
    return false;
  }
  return arr[arr.length - 1].end === undefined;
}

const gty = (y) => {
  const currentYear = new Date().getFullYear() % 100;
  const graduationYear = parseInt(y, 10);
  const grade =
    currentYear >= graduationYear ? 12 : 13 - (graduationYear - currentYear);
  return Math.max(1, Math.min(12, grade));
};

var uData;

socket.emit("findUsers", "#", (response) => {
  if (response.status == "ok") {
    document.getElementById("list").innerHTML = "";
    var tData = response.data;
    uData = tData.slice(); // Create a shallow copy to avoid modifying the original array
    uData.sort((a, b) => {
      const lastNameA = a.name.split(" ").pop(); // Extract last name of a
      const lastNameB = b.name.split(" ").pop(); // Extract last name of b
      return lastNameA.localeCompare(lastNameB); // Compare last names alphabetically
    });
    var numy = 1;

    // MASS DATA FIELDS

    document.getElementById("total_students").innerText = uData.length;
    document.getElementById("active_students").innerText = activeUsers(uData);
    document.getElementById("total_hours").innerText =
      Math.round(uData.reduce((acc, obj) => acc + obj.hours, 0) * 10) / 10;
    document.getElementById("retention").innerText = "N/A"; //retention(uData);

    //

    uData.forEach((s) => {
      var recd = "";

      if (s.record === undefined || s.record.length == 0) {
        const textField = document.createElement("p");
        recd = "-";
      } else {
        const reversedData = [...s.record].reverse();
        // console.log(reversedData);

        let rtindex = -1;

        while (recd == "") {
          rtindex += 1;
          ritem = reversedData[rtindex];
          const timeDifference = new Date(ritem.end) - new Date(ritem.start);
          if (!(timeDifference > 0 && timeDifference <= 10 * 60 * 1000)) {
            recd = formatDate1(ritem.start, ritem.end);
          }
        }
      }

      const validMeetings =
        s?.record?.filter(
          (e) => new Date(e.end) - new Date(e.start) > 15 * 60 * 1000
        ) || [];

      const avgm =
        validMeetings.length > 0
          ? (
            validMeetings.reduce(
              (t, e) => t + (new Date(e.end) - new Date(e.start)),
              0
            ) /
            (validMeetings.length * 3600000)
          ).toFixed(3)
          : "-";

      if (s.hours == 0) {
        hrd = "-";
      } else {
        hrd = s.hours;
      }

      document.getElementById("list").innerHTML += `<tr>
  <td><span class="text-muted">${numy}</span></td>
  <td><a class="text-reset" tabindex="-1">${s.name}</a></td>
  <td>${s.id}</td>
  <td>${hrd}</td>
  <td>${avgm}</td>
  <td>20${s.grad}</td>
  <td>${recd}</td>
</tr>`;

      numy += 1;
    });
  } else {
    alert("There was an error!");
  }

  const meetingDays = {};

  uData.forEach((user) => {
    const uniqueLoginsPerDay = new Set();

    user.record.forEach((entry) => {
      const utcStartTime = new Date(entry.start);
      const pacificStartTime = new Date(
        utcStartTime.toLocaleString("en-US", {
          timeZone: "America/Los_Angeles",
        })
      );
      const date = pacificStartTime.toLocaleDateString("en-US", {
        timeZone: "America/Los_Angeles",
      });

      if (!uniqueLoginsPerDay.has(date)) {
        uniqueLoginsPerDay.add(date);

        if (!meetingDays[date]) {
          meetingDays[date] = 1;
        } else {
          meetingDays[date]++;
        }
      }
    });
  });

  const meetingDaysAA = Object.fromEntries(
    Object.entries(meetingDays).filter(([date, value]) => value >= 20)
  );

  const weeklyMovingAverage = {};
  const dates = Object.keys(meetingDaysAA).sort();

  dates.forEach((date, index) => {
    const weeklyDates = dates.slice(Math.max(0, index - 6), index + 1);
    const weeklyTotal = weeklyDates.reduce(
      (total, d) => total + (meetingDaysAA[d] || 0),
      0
    );
    weeklyMovingAverage[date] = weeklyTotal / Math.min(7, weeklyDates.length);
  });

  var meetingDaysData = meetingDays;
  var weeklyMovingAverageData = weeklyMovingAverage;

  window.ApexCharts &&
    new ApexCharts(document.getElementById("chart-a"), {
      chart: {
        type: "bar",
        fontFamily: "inherit",
        height: 240,
        parentHeightOffset: 0,
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false,
        },
        stacked: true,
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: 1,
      },
      series: [
        {
          name: "Students Present",
          data: Object.values(meetingDaysData),
        },
      ],
      tooltip: {
        theme: "dark",
      },
      grid: {
        padding: {
          top: -20,
          right: 0,
          left: -4,
          bottom: -4,
        },
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        labels: {
          padding: 0,
        },
        tooltip: {
          enabled: false,
        },
        axisBorder: {
          show: false,
        },
        type: "datetime",
      },
      yaxis: {
        labels: {
          padding: 4,
        },
      },
      labels: Object.keys(meetingDaysData),
      colors: [
        tabler.getColor("primary"),
        tabler.getColor("primary", 0.8),
        tabler.getColor("green", 0.8),
      ],
      legend: {
        show: false,
      },
    }).render();

  const cData = Object.keys(weeklyMovingAverageData).map((date) => ({
    x: new Date(date).getTime(),
    y: weeklyMovingAverageData[date],
  }));

  const roundedData = cData.map((point) => ({
    x: point.x,
    y: Math.round(point.y * 100) / 100,
  }));

  const sortedDates = Object.keys(meetingDaysAA).sort(
    (a, b) => new Date(a) - new Date(b)
  );
  roundedData.sort((a, b) => new Date(a.x) - new Date(b.x));
  const xaxisLabels = sortedDates.map((date) => new Date(date).getTime());

  const seriesValues = sortedDates.map((date) => {
    const dataPoint = roundedData.find(
      (point) => point.x === new Date(date).getTime()
    );
    return dataPoint ? dataPoint.y : 0;
  });

  window.ApexCharts &&
    new ApexCharts(document.getElementById("chart-b"), {
      chart: {
        type: "line",
        fontFamily: "inherit",
        height: 240,
        parentHeightOffset: 0,
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: 1,
      },
      markers: {
        size: 5,
      },
      series: [
        {
          name: "Weekly Moving Average",
          type: "line",
          data: seriesValues,
        },
      ],
      tooltip: {
        theme: "dark",
      },
      grid: {
        padding: {
          top: -20,
          right: 0,
          left: -4,
          bottom: -4,
        },
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        labels: {
          padding: 0,
        },
        tooltip: {
          enabled: false,
        },
        axisBorder: {
          show: false,
        },
        type: "datetime",
      },
      yaxis: {
        labels: {
          padding: 4,
        },
      },
      labels: xaxisLabels,
      colors: [tabler.getColor("primary"), tabler.getColor("green", 0.8)],
      legend: {
        show: false,
      },
    }).render();

  window.dispatchEvent(new Event("resize"));

  setTimeout(function () {
    document.getElementById("overlay").remove();
  }, 400);
});

function makePDF() {
  var formattedDate = new Date()
    .toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(/\/|,|\s|:/g, "-");

  function ddfh() {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const currentDate = new Date();
    const month = months[currentDate.getMonth()];
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();

    // Pad day with leading zero if needed
    const paddedDay = day < 10 ? `0${day}` : day;

    return `${month} ${paddedDay} ${year}`;
  }

  //   var opt = {
  //     margin:       0,
  //     filename:     'attendance-report-'+formattedDate+'.pdf',
  //     image:        { type: 'jpeg', quality: 0.98 },
  //     html2canvas:  { scale: 2 },
  //     jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  //   };
  //   document.body.style.zoom = "50%";
  //   setTimeout(function() {
  //   html2pdf().set(opt).from(document.getElementById("pdf-section")).save();
  // },500);
  //   //document.body.style.zoom = "100%";

  //socket.emit("makePdf")

  document.getElementById("s-gen").innerText = ddfh();
  document.getElementById("s-btn").style.display = "none";
  document.getElementById("s-ftr").style.display = "none";

  html2canvas(document.querySelector("#pdf-section")).then((canvas) => {
    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL("image/png");

    fetch("https://2374a.ariesninja.repl.co:8080/makePdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dataUrl }),
    })
      .then((response) => response.text())
      .then((message) => console.log(message))
      .catch((error) => console.error("Error sending data to server:", error));

    // Create a link element for downloading
    //const downloadLink = document.createElement('a');
    //downloadLink.href = dataUrl;

    //downloadLink.download = 'attendance-report-'+formattedDate+'.png';

    // Append the link to the body
    //document.body.appendChild(downloadLink);

    // Trigger the click event to start the download
    //downloadLink.click();
  });

  document.getElementById("s-gen").innerText = "REPORT GENERATOR";
  document.getElementById("s-btn").style.display = "block";
  document.getElementById("s-ftr").style.display = "none";
}
