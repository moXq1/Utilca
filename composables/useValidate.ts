type Tval = "text" | "number" | "email" | "password";

export const useValidate = (type: Tval) => {
  function validate(value: number | string) {
    switch (type) {
      case "text":
        return validateText(value as string);
      case "number":
        return validateNumber(value as number);
      case "email":
        return validateEmail(value as string);
      case "password":
        return validatePassword(value as string);
    }
  }

  function validateNumber(value: number) {
    return typeof value === "number" ? false : true;
  }
  function validateText(value: string) {
    return !(value.length >= 3 && value.length <= 25);
  }
  function validateEmail(value: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !regex.test(value);
  }

  function validatePassword(value: string) {
    if (value.length < 8) {
      return true;
    }
    // const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    const regex = /^(?=.*[a-z])(?=.*\d).{8,}$/;

    return !regex.test(value);
  }

  return { validate };
};
