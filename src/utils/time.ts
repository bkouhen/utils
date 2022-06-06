/**
 * Pause the execution of the current script for x miliseconds
 * @param delay in miliseconds
 */
export const waitFor = (delay: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};
