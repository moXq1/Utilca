export default function dataFormat(str: any) {
  if (str.seconds) {
    return formatDate(str.seconds);
  }

  const date = new Date(str);
  const timeString = date.toLocaleTimeString();
  const dateString = date.toLocaleDateString();
  return dateString;
}

function formatDate(seconds: number) {
  let t = new Date(1970, 0, 1);
  t.setSeconds(seconds);
  //@ts-ignore
  t = t.toLocaleString("default", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return t;
  //return `${t.getDate().toString().padStart(2, "0")}.${t
  // .getUTCMonth()
  // .toString()
  // .padStart(2, "0")}.${t.getFullYear()}`;
}
