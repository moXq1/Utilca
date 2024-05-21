import { DataSnapshot } from "firebase/database";

export default function dataToArr(data: DataSnapshot) {
  const res: DataSnapshot[] = [];
  for (let [key, value] of Object.entries(data)) {
    res.push(value);
  }

  return res;
}
