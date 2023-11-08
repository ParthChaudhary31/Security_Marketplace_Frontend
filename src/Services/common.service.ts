import JSBI from "jsbi";
const BigValue = require("bignumber.js");

/**CUTMIZE ADDRESS FOR SHOW */
export const customizeAddress = (address: string) => {
  let firstFive = address.substring(0, 5);
  let lastFour = address.substring(address.length - 4);
  return firstFive + "..." + lastFour;
};

function numberToString(arg: any) {
  if (typeof arg === "string") {
    if (!arg.match(/^-?[0-9.]+$/)) {
      throw new Error(
        "while converting number to string, invalid number value '" +
          arg +
          "', should be a number matching (^-?[0-9.]+)."
      );
    }
    return arg;
  } else if (typeof arg === "number") {
    return String(arg);
  } else if (
    typeof arg === "object" &&
    arg.toString &&
    (arg.toTwos || arg.dividedToIntegerBy)
  ) {
    if (arg.toPrecision) {
      return String(arg.toPrecision());
    } else {
      // eslint-disable-line
      return arg.toString(10);
    }
  }
  throw new Error(
    "while converting number to string, invalid number value '" +
      arg +
      "' type " +
      typeof arg +
      "."
  );
}

// Function to convert into wei
function toWei(input: any, unit: any) {
  let ether = numberToString(input); // eslint-disable-line
  let base = unit;
  let baseLength = base.length - 1 || 1;
  if (ether === ".") {
    throw new Error(
      "[ethjs-unit] while converting number " + input + " to wei, invalid value"
    );
  }

  // Is it negative?
  let negative = ether.substring(0, 1) === "-";

  if (negative) {
    ether = ether.substring(1);
  }
  // Split it into a whole and fractional part
  let comps = ether.split("."); // eslint-disable-line
  if (comps.length > 2) {
    throw new Error(
      "[ethjs-unit] while converting number " +
        input +
        " to wei,  too many decimal points"
    );
  }
  let whole = comps[0],
    fraction = comps[1]; // eslint-disable-line
  if (!whole) {
    whole = "0";
  }
  if (!fraction) {
    fraction = "0";
  }
  if (fraction.length > baseLength) {
    throw new Error(
      "[ethjs-unit] while converting number " +
        input +
        " to wei, too many decimal places"
    );
  }

  while (fraction.length < baseLength) {
    fraction += "0";
  }

  if (!parseInt(whole)) {
    return fraction.replace(/^0*(?=[1-9])/g, "");
  }

  if (negative) {
    return "-" + whole + fraction;
  }

  return whole + fraction;
}

function fromWei(input, unit) {
  if (!input) return "0";

  let str = "";

  if (Math.sign(input) !== Math.sign(unit)) str += "-";

  const numer = Math.abs(input);
  const denom = Math.abs(unit);

  str += Math.floor(numer / denom);
  let rem = numer % denom;
  if (rem === 0) return str;
  str += ".";

  const map = new Map();

  while (rem !== 0) {
    map.set(rem, str.length);

    rem *= 10;
    str += Math.floor(rem / denom);
    rem %= denom;

    if (map.has(rem)) {
      const idx = map.get(rem);
      return str.slice(0, idx) + `(${str.slice(idx)})`;
    }
  }
  return str;
}

const intToSuffixes = (num: any, fixed = 2) => {
  if (num === null) {
    return null;
  } // terminate early
  if (num === 0) {
    return "0";
  } // terminate early
  fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
  let b: any = num.toPrecision(2).split("e"), // get power
    k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
    c =
      k < 1
        ? num.toFixed(0 + fixed)
        : (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
    d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
    e = d + ["", "K", "M", "B", "T"][k]; // append power
  return e;
};

export const divideBigNumber = (
  value: any,
  decimal: number,
  suffixes = false
) => {
  if (decimal === 0) {
    return "0";
  } else {
    const decimalBigN = JSBI.BigInt(decimal);
    const convertedDecimal = JSBI.exponentiate(JSBI.BigInt(10), decimalBigN);
    let x = new BigValue(value?.toString());
    let y = new BigValue(String(convertedDecimal));
    let z = x.dividedBy(y);
    return suffixes ? intToSuffixes(parseInt(z.toString())) : z.toString();
  }
};

/** Divide with Decimal*/
export const divideWithDecimal = (value: any, decimal: any) => {
  const decimalBigN = JSBI.BigInt(decimal);
  const convertedDecimal = JSBI.exponentiate(JSBI.BigInt(10), decimalBigN);
  return fromWei(value, String(convertedDecimal));
};

/**CONVERT NUMBER WITH DECIMALS FOR CONTRACT CALL */
export const convertWithDecimal = (value: any, decimal: any) => {
  const decimalBigN = JSBI.BigInt(decimal);
  const convertedDecimal = JSBI.exponentiate(JSBI.BigInt(10), decimalBigN);
  return toWei(value, String(convertedDecimal));
};

/** Multiply with big numbers */
export const multiplyTwoBigDigits = (valueOne: any, valueTwo: any) => {
  const a = JSBI.BigInt(valueOne);
  const b = JSBI.BigInt(valueTwo);
  const result = JSBI.multiply(a, b);
  return String(result);
};

export const multiplyBigDigitsWithDecimals = (
  valueOne: string,
  valueTwo: string
) => {
  let a: any;
  let b: any;
  let decimalLengthA: any = 0;
  let decimalLengthB: any = 0;
  if (valueOne.includes(".")) {
    a = convertWithDecimal(valueOne, valueOne.split(".")[1].length);
    decimalLengthA = valueOne.split(".")[1].length;
  } else {
    a = valueOne;
  }
  if (valueTwo.includes(".")) {
    b = convertWithDecimal(valueTwo, valueTwo.split(".")[1].length);
    decimalLengthB = valueTwo.split(".")[1].length;
  } else {
    b = valueTwo;
  }
  let decimalLength = decimalLengthA + decimalLengthB;
  let result = multiplyTwoBigDigits(a, b);

  if (
    result.substring(0, result.length - decimalLength).length &&
    result.substring(result.length - decimalLength).length
  ) {
    result =
      result.substring(0, result.length - decimalLength) +
      "." +
      result.substring(result.length - decimalLength);
  } else if (!result.substring(0, result.length - decimalLength).length) {
    // eslint-disable-next-line
    result = "0" + "." + result.substring(result.length - decimalLength);
  }
  return result;
};

/**CHECK STRING IS NUMBER */
export const isInt = (n) => {
  return n % 1 === 0;
};

/**REMOVE e FORM BIG NUMBER */
export const toFixed = (x) => {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x;
};

/**GET ERROR MESSAGE FORM ERROR OBJECT */
export const getError = (error: any) => {
  let errorMsg =
    error && error.message ? error.message : "Something went wrong";
  if (errorMsg.indexOf("execution reverted") > -1) {
    let msg = errorMsg;
    msg = msg =
      msg.indexOf("execution reverted:") > -1
        ? msg.split("execution reverted:")[1].split("{")[0]
        : msg;
    return msg;
  } else if (errorMsg.indexOf("INVALID_ARGUMENT") > -1) {
    return errorMsg.split("(")[0];
  } else if (errorMsg.indexOf("MetaMask Tx Signature") > -1) {
    let msg = errorMsg.replace("MetaMask Tx Signature:", "");
    return msg;
  } else {
    let err = errorMsg.split("*")[0].split(":")[1];
    if (err?.trim() === "insufficient funds for gas") {
      return err;
    } else {
      return errorMsg;
    }
  }
};

/**CREATE URL FOR API CALL WITH PARAMS */
export const formatUrl = (url, params) => {
  params =
    params && Object.keys(params).length > 0
      ? `?${new URLSearchParams(params).toString()}`
      : "";

  // Remove leading and trailing spaces from the URL
  url = url.trim();
  return `${url}${params}`;
};

/**ALLOW ONLY STRING */
export const allowOnlyString = (inputString) => {
  let res = /^[a-zA-Z]+$/.test(inputString);
  return res;
};

/**SHOW VALUE WITH ONLY SELECTED DECIMALS */
export const fixedToDecimal = (value, decimals = 4) => {
  value =
    value && parseFloat(value) > 0
      ? decimals === 2
        ? value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
        : value.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0]
      : 0;
  return value;
};
export const cryptoDecimals = (inValue: any) => {
  let value = Number(inValue);
  if (value === 0) {
    return 0.0;
  } else if ((value > 0 && value <= 9) || (value < 0 && value >= -9)) {
    return toCustomFixed(value, 5);
  } else if ((value > 9 && value <= 99) || (value < -9 && value >= -99)) {
    return toCustomFixed(value, 4);
  } else if ((value > 99 && value <= 999) || (value < -99 && value >= -999)) {
    return toCustomFixed(value, 3);
  } else if (
    (value > 999 && value <= 9999) ||
    (value < -999 && value >= -9999)
  ) {
    return toCustomFixed(value, 2);
  } else if (value > 9999 || value < -9999) {
    return toCustomFixed(value, 0);
  }
};
const toCustomFixed = (num: any, fixed: number) => {
  const re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(re)[0];
};
