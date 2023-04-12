import React from "react";

var waEra = [
  { start: new Date(2019, 4, 1), name: "令和" },
  { start: new Date(1989, 0, 8), name: "平成" },
  { start: new Date(1926, 11, 24), name: "昭和" },
  { start: new Date(1912, 6, 30), name: "大正" },
  { start: new Date(1868, 0, 25), name: "明治" },
];

// // JulianDateをDateオブジェクトに変換する関数
// function julianDateToDate(jd) {

//   var totalMilliSeconds = (jd.dayNumber - 2440587.5) * 86400000 + jd.secondsOfDay * 1000;
  
//   var date =new Date(totalMilliSeconds);
//   return date;
//   // return new Date(date.toLocaleString("ja-JP", { timeZone: "Europe/London" }));
// }

// 西暦の日付を和暦にフォーマットする関数
function formatDateToJapaneseEra(datetime) {

  
  var date = datetime;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  // 和暦に変換
  let eraName = '';
  let eraYear = year;
  for (let i = 0; i < waEra.length; i++) {
    const era = waEra[i];
    if (date >= era.start) {
      eraName = era.name;
      eraYear = year - era.start.getFullYear() + 1;
      break;
    }
  }

  // 時分秒を2桁の数字にする
  const pad = (n) => n.toString().padStart(2, '0');

  // 和暦の年月日と時分秒を返す
  return `${eraName}${eraYear}年${month}月${day}日 ${pad(hour)}時${pad(minute)}分${pad(second)}秒`;
}

function Wareki(props) {
   const waDate = formatDateToJapaneseEra(props.datetime);

  return <div>{waDate}</div>;
}

export default Wareki;
