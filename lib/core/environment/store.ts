export const store = (() => {
  let variables: Record<string, string> = {};

  const setVariables = (values: any) => {
    variables = {
      ...values,
    };
  };

  const getVariables = () => {
    return variables;
  };

  return {
    setVariables,
    getVariables,
  };
})();

export const getEnv = () => store.getVariables();
