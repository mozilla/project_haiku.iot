function lerp(a, b, u) {
  return (1 - u) * a + u * b;
}

function wrap(num, ubound) {
  num = num % ubound;
  if (num < 0) {
    num = ubound + num;
  }
  return num;
}

function vectorLerp(start, end, u, result) {
  result = result || {};
  Object.keys(start).forEach(key => {
    result[key] = lerp(start[key], end[key], u);
  });
  return result;
}

function clamp(num, lbound, ubound) {
  return Math.min(ubound, Math.max(num, lbound));
}

function getRange(lbound, ubound, numIncrements) {
  var delta = ubound - lbound;
  var sign = delta >= 1 ? 1 : -1;
  numIncrements = numIncrements || 10;
  var increment;
  for(var pow = 0;; pow += sign) {
    if (sign === 1 && Math.pow(10, pow) > delta) {
      ubound = Math.ceil(ubound / Math.pow(10, pow-1)) * Math.pow(10, pow-1);
      lbound = Math.floor(Math.pow(10, 1-pow) * (lbound - lbound/10)) * Math.pow(10, pow-1)
      increment = (ubound-lbound)/numIncrements;
      break;
    } else if (sign === -1 && Math.pow(10, pow < delta)) {
      ubound = Math.ceil(ubound / Math.pow(10, pow-1)) * Math.pow(10, pow-1);
      lbound = Math.floor(Math.pow(10, 1-pow) * (lbound - lbound/10)) * Math.pow(10, pow-1);
      increment = (ubound-lbound)/numIncrements;
      break;
    }
  }
  return [lbound,ubound,increment];
}

