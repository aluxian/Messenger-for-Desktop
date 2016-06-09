import prefs from 'browser/utils/prefs';

const distribMap = {
  'darwin64:dmg': 10,
  'darwin64:zip': 11,
  'win32:installer': 20,
  'win32:portable': 21,
  'linux32:deb': 30,
  'linux64:deb': 31,
  'linux32:rpm': 32,
  'linux64:rpm': 33
};

/**
 * Generate a raffle code.
 *
 * AABCCCCDDDD
 *
 * A = distrib
 * B = portable
 * C = build number (radix 36)
 * D = random digits (radix 36)
 */
function generateCode () {
  let code = '';
  let preNum;

  // AA
  if (distribMap[global.manifest.distrib]) {
    code += distribMap[global.manifest.distrib];
  } else {
    code += 99;
  }

  // B
  if (global.manifest.portable) {
    code += 1;
  } else {
    code += 0;
  }

  // CCCC
  const buildNum = parseInt(global.manifest.buildNum || 0, 10).toString(36);
  preNum = 4 - buildNum.length;
  while (preNum--) code += '0';
  code += buildNum;

  // DDDD
  const randNum = Math.floor(Math.random() * 1000000).toString(36);
  preNum = 4 - randNum.length;
  while (preNum--) code += '0';
  code += randNum;

  return code.toUpperCase();
}

/**
 * @return the raffle code, generated if it doesn't exist
 */
function getCode () {
  let code = prefs.get('raffle-code');
  if (!code) {
    code = generateCode();
    prefs.set('raffle-code', code);
  }
  return code;
}

export default {
  generateCode,
  getCode
};
