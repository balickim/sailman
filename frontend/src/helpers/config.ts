const getEnvironmentVariable = (environmentVariable: string): string => {
  const unvalidatedEnvironmentVariable = process.env[environmentVariable];
  if (!unvalidatedEnvironmentVariable) {
    throw new Error(`Couldn't find environment variable: ${environmentVariable}`);
  } else {
    return unvalidatedEnvironmentVariable;
  }
};

export const serverSideConfig = {
  //   nodeEnv: getEnvironmentVariable('APP_ENV'),
  //   appName: getEnvironmentVariable('APP_NAME'),
};
