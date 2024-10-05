// ใช้สำหรับคนเดียวได้
function avgPlayTime(hours_played, day_played) {
    let result = hours_played / day_played
    return result;
};
// ใช้สำหรับคนเดียวได้
function avgDailyNumberOfGame(login_times, day_played) {
    let result = login_times / day_played
    return result;
};
function avgRevenuePerDailyActiveUser(lifetimeRevenue, allPlayingUser) {
    let result = lifetimeRevenue / allPlayingUser
    return result;
};
// ใช้สำหรับคนเดียวได้
function userLifeTimeValue(day_played, items_purchased, allPlayer) {
    let result = day_played * ( items_purchased / allPlayer)
    return result;
};
function CustomerAcquisitionCost(Total_acquisition_costs, Number_of_new_players) {
    let result = Total_acquisition_costs / Number_of_new_players
    return result;
};
function RetentionRates(Total_acquisition_costs, Number_of_new_players) {
    let result = Total_acquisition_costs / Number_of_new_players
    return result;
};
function average_revenue_per_user(Total_revenue, Total_number_of_users_in_cohort) {
    // ARPU = จำนวนรายได้ทั้งหมด / จำนวนผู้เล่นที่เล่นมาแล้ว 30 วัน (สมมุติ)
    let result = Total_revenue / Total_number_of_users_in_cohort
    return result;
};

if (Notification.permission === 'default') {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      showNotification("Notification", "Notification has been accept");
    }
  });
} 
/*
else if (Notification.permission === 'granted') {
  showNotification("Notification Test", "just test");
}
*/


function showNotification(Title, Body) {
  const title = Title == '' ? 'New nitification' : Title;
  const options = {
    body: Body == '' ? '' : Body,
  };

  new Notification(title, options);
}

fetch("/players")
  .then((response) => response.json())
  .then((data) => {
    console.log("data player", data);
    const tbBody = document.getElementById("tbBody");
    const tbHead = document.getElementById("tbHead");

    if (data.length > 0) {
      const headerRow = document.createElement("tr");
      const firstPlayer = data[0];
      const username = Object.keys(firstPlayer).find(
        (key) => key !== "_id" && key !== "__v"
      );
      const playerData = firstPlayer[username];

      const usernameHeader = document.createElement("th");
      usernameHeader.textContent = "Username";
      headerRow.appendChild(usernameHeader);

      const tableHeadWord = ["Average Play Time", "Average Login Game", "User LifeTime Value", "Predic Goodbye Player"];
      for (const i in tableHeadWord) {
        const th = document.createElement("th");
        th.textContent = tableHeadWord[i]
        headerRow.appendChild(th);
      }

      tbHead.appendChild(headerRow);
    }

    data.forEach((player) => {
      const username = Object.keys(player).find(
        (key) => key !== "_id" && key !== "__v"
      );
      const playerData = player[username];

      if (playerData) {
        const row = document.createElement("tr");

        const usernameCell = document.createElement("td");
        usernameCell.textContent = username;
        row.appendChild(usernameCell);

        let avgPlayTime_result = avgPlayTime(playerData.hours_played, playerData.day_played);
        let avgDailyNumberOfGame_result = avgDailyNumberOfGame(playerData.login_times, playerData.day_played)
        let userLifeTimeValue_result = userLifeTimeValue(playerData.day_played, playerData.items_purchased, data.length)

        const apt = document.createElement("td");
        apt.textContent = avgPlayTime_result;
        row.appendChild(apt);

        const Average_Login_Game = document.createElement("td");
        Average_Login_Game.textContent = avgDailyNumberOfGame_result;
        row.appendChild(Average_Login_Game);

        const User_LifeTime_Value = document.createElement("td");
        User_LifeTime_Value.textContent = userLifeTimeValue_result;
        row.appendChild(User_LifeTime_Value);

        if (avgPlayTime_result < 1 && avgDailyNumberOfGame_result < 1 && playerData.day_played > 90) {
          const predic = document.createElement("td");
          predic.textContent = "Yes";
          let textt = "ผู้เล่น "+ username + " ได้เลิกติดเกมแล้ว"
          showNotification("Notification", textt)
          row.appendChild(predic);
        } else if (avgPlayTime_result > 1 && avgDailyNumberOfGame_result > 1 && userLifeTimeValue_result > 0) {
          const predic = document.createElement("td");
          predic.textContent = "May be";
          row.appendChild(predic);
        } else {
          const predic = document.createElement("td");
          predic.textContent = "No";
          row.appendChild(predic);
        }

        tbBody.appendChild(row);
      } else {
        console.log("error in data foreach:", username);
      }
    });
  })
  .catch((error) => {
    console.log("error fetch player data:", error);
  });
