export function getGooveeEnvironment() {
  const prefix = 'GOOVEE_PUBLIC_';

  const variables = Object.entries(process.env)
    .filter(([key]) => key.startsWith(prefix))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as any);

  return variables;
}
