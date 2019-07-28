const charSet: { [key: string]: string[] } = {
  lowerCaseSafe: [],
  lowerCase: [],
  upperCaseSafe: [],
  upperCase: [],
  digitsSafe: [],
  digits: [],

  allCaseSafe: [],
  allCase: [],
  allSafe: [],
  all: [],
};

charSet.lowerCaseSafe = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'm',
  'n',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

charSet.lowerCase = [...charSet.lowerCaseSafe, 'l', 'o'];

charSet.upperCaseSafe = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'M',
  'N',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

charSet.upperCase = [...charSet.upperCaseSafe, 'I', 'O'];
charSet.digitsSafe = ['2', '3', '4', '5', '6', '7', '8', '9'];
charSet.digits = [...charSet.digitsSafe, '1', '0'];
charSet.allCaseSafe = [...charSet.lowerCaseSafe, ...charSet.upperCaseSafe];
charSet.allCaseSafe = [...charSet.lowerCase, ...charSet.upperCase];
charSet.allSafe = [
  ...charSet.lowerCaseSafe,
  ...charSet.upperCaseSafe,
  ...charSet.digitsSafe,
];
charSet.all = [...charSet.lowerCase, ...charSet.upperCase, ...charSet.digits];

export default charSet;
