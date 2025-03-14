import React from 'react'

const EmailVerify = () => {
  const inputRefs = React.useRef([]);

const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
    }
};

const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
        inputRefs.current[index - 1].focus();
    }
};
const handlePaste = (e) => {
  const paste = e.clipboardData.getData('text');
  const pasteArray = paste.split('');
  
  pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
          inputRefs.current[index].value = char;
      }
  });
};

  return (
    <div>EmailVerify</div>
  )
}

export default EmailVerify