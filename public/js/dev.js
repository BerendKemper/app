function numbersToBinaryCustom(...numbers) {
    return numbers.map(numberToBinary).join(" ");
}
function numberToBinary(number) {
    return ("0000000" + number.toString(2)).slice(-8);
}
function parseIntCustom(string) {
    return parseint(string.split(" ").join(""), 2);
}