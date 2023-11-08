import moment from "moment";
import { BID_TOKEN_DECIMAL } from "../../Constant";

export const exponentialToDecimal = (exponential: any) => {
    if (exponential) {
    let decimal = exponential.toString().toLowerCase();
    if (decimal.includes('e+')) {
        const exponentialSplitted = decimal.split('e+');
        let postfix = '';
        for (
            let i = 0; i <
            +exponentialSplitted[1] -
            (exponentialSplitted[0].includes('.') ? exponentialSplitted[0].split('.')[1].length : 0); i++
        ) {
            postfix += '0';
        }
        const addCommas = (text: any) => {
            let j = 3;
            let textLength = text.length;
            while (j < textLength) {
                text = `${text.slice(0, textLength - j)},${text.slice(textLength - j, textLength)}`;
                textLength++;
                j += 3 + 1;
            }
            return text;
        };
        decimal = addCommas(exponentialSplitted[0]?.replace('.', '') + postfix);
    }
    if (decimal.toLowerCase().includes('e-')) {
        const exponentialSplitted = decimal.split('e-');
        let prefix = '0.';
        for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
            prefix += '0';
        }
        decimal = prefix + exponentialSplitted[0]?.replace('.', '');
    }
    return decimal;
  }
}

//generate rendom salt
 export const makeId= async(length: any) =>{
    let result = "";
    let characters = "0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt((Math.random() * charactersLength));
    }
    return (result);
  }

//token decimal multipal
  export const valueInToTokenDecimal = (value:any)=>{
    let decimalValue: any = (10 ** BID_TOKEN_DECIMAL);
    decimalValue = (value) * (decimalValue);
    decimalValue= exponentialToDecimal(decimalValue);
    const numberValue = (decimalValue?.replace(/,/g, '')?.replace(/^0+/, '')); // Remove commas and leading zeros
    return numberValue;
  }

  export const remove18DecimalComma = (value:any)=>{
    const numberValue = (value?.replace(/,/g, '')?.replace(/^0+/, '')); // Remove commas and leading zeros
    let valueReadable: any = (10 ** BID_TOKEN_DECIMAL);
    valueReadable = (numberValue) / (valueReadable);
    return valueReadable;
  }
  export const removeComma = (value:any)=>{
    const numberValue = parseFloat(value?.replace(/,/g, ''));    // Remove commas and leading zeros
    return numberValue;
  }

  // Date in to Epoch milliseconds
  export const DateInToMilliEpoch =(date:any)=>{
    const dataTime = date;
    const formattedDate = moment(dataTime, "DD/MM/YYYY");
    let AuditEpoch = formattedDate?.unix();
    AuditEpoch = AuditEpoch * 1000
    return AuditEpoch;
  }
  export const currentMilliEpoch =()=>{
    let currentEpoch: any = Date.now()
    currentEpoch = currentEpoch.toString();
    currentEpoch = parseInt(currentEpoch);
    return currentEpoch;
  }