type Address = {
  id: string;
  name: string;
  gasPrice: number;
  waterPrice: number;
  electricityPrice: number;
  createdAt?: string;
  updatedAt?: string;
  internet: number;
  intercom: number;
  gasRaspred: number;
  abonplata: number;
  garbage: number;
  kvartplata: number;
  userID: string;
  heating?: number;
};

type Tarif = {
  id: string;
  userID: string;
  createdAt?: string;
  updatedAt?: string;
  addressID: string;
  prevGas: number;
  currGas: number;
  distinctionGas: number;
  totalGas: number;
  prevWater: number;
  currWater: number;
  distinctionWater: number;
  totalWater: number;
  prevElec: number;
  currElec: number;
  distinctionElec: number;
  totalElec: number;
  heating?: number;
  total: number;
};
