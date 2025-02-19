

export const textLettersLimit = (text, limitType) => {

    if (typeof text !== 'string' || typeof limitType !== 'number') {
      return text;
    }
  
    if (text.length > limitType) {
      return `${text.substring(0, limitType)}...`;
    }
  
    return text;
  };


//   export const HEADERS = { "x-auth-token": localStorage.getItem('token')}


