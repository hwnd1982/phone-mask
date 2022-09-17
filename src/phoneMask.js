const phoneMask = (selector, masked = '+7 (___) ___-__-__') => {
  let prevValue = '';
  const elems = document.querySelectorAll(selector);

  const placeholdersPosition = masked.split('').reduce((placeholders, symbol, index) => {
    if (symbol === `_`) placeholders.push(index);

    return placeholders;
  }, []);

  const startPosition = masked.indexOf('_');

  const addSymbol = (symbol, str) => {
    let value = str;
    const currentPosition = placeholdersPosition.indexOf(str.length);

    if (currentPosition === -1)
      value += masked.slice(str.length).match(/^[^_]+/)?.toString() || '';
    
    return value + symbol
  };

  function mask(event) {
    let position = event.target.selectionStart;
    let value = event.target.value.slice(0, masked.length - 1);
    const symbol = event.data;
    const digitalValue = event.target.value.slice(Math.max(startPosition, position)).replace(/\D+/g, '');

    if (symbol === null && position > startPosition - 1) {
      value = value.length < startPosition + 1 ? masked.match(/^[^_]+/)?.toString() : value.replace(/[\D]+$/, '');
        
      prevValue = value;
      event.target.value = value;
      return;
    }

    if (/\D/.test(symbol) || position < startPosition + 1) {
      event.target.value = prevValue;

      if (position < startPosition + 1) {
        event.target.selectionEnd = event.target.selectionStart = startPosition;
      }
      return;
    }

    value = addSymbol(symbol, value.slice(0, position - 1));
    position = value.length;
    digitalValue.split('').forEach(num => value = addSymbol(num, value));

    prevValue = event.target.value = value.slice(0, masked.length);
    event.target.selectionEnd = event.target.selectionStart = position;
  }

  const blur = ({target}) =>
    target.value = target.value.length < startPosition + 1 ? '' : target.value.replace(/[\D]+$/, '');
  
  const focus = ({target}) => {
    target.value += masked.slice(target.value.length).match(/^[^_]+/)?.toString() || '';
    prevValue = target.value;
  }
  
  
  for (const elem of elems) {
    elem.addEventListener('input', mask);
    elem.addEventListener('focus', focus);
    elem.addEventListener('blur', blur);
  }
};

export default phoneMask;