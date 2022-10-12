const number = function(value) {
  var toFixedNum = Number(value).toFixed(3);
  var realVal = toFixedNum.substring(0, toFixedNum.toString().length - 1);
  return realVal;
};
export default {
  number
};
