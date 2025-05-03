function CartId(): string | null {
  const generateRandomString = (): void => {
    const length: number = 6;
    const characters: string = "1234567890";
    let randomString: string = "";

    for(let i: number = 0; i < length; i++) {
      const randomIndex: number = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    localStorage.setItem('randomString', randomString);
  };

  const existingRandomString: string | null = localStorage.getItem("randomString");

  if(!existingRandomString) {
    generateRandomString();
  }

  return existingRandomString;
}

export default CartId; 