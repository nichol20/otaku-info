export const debounce = <T extends any[]>(
  cb: (...args: T) => void,
  delay: number
) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => cb(...args), delay);
  };
};
