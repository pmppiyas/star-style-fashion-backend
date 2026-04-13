import { StatusCodes } from 'http-status-codes';

interface errType {
  path: string;
  message: string;
}

export let errorSources: errType[] = [];
let errMode: any[] = [];
let missing: string[] = [];

const resetState = () => {
  errorSources = [];
  errMode = [];
  missing = [];
};

export const handleZodValidationError = (err: any) => {
  resetState();

  const issues = err.issues || [];

  if (issues.length === 0) {
    return {
      message: err.message || 'Zod validation failed',
      statusCode: StatusCodes.BAD_REQUEST,
    };
  }

  issues.forEach((issue: any) => {
    const path = issue.path[issue.path.length - 1];

    errorSources.push({
      path: String(path),
      message: issue.message,
    });

    if (path) {
      missing.push(String(path));
    }

    errMode.push(issue);
  });

  const capitalizedFields = missing
    .map((item: string) =>
      item ? item.charAt(0).toUpperCase() + item.slice(1) : 'Field'
    )
    .join(', ');

  const prefix =
    errMode[0]?.received === 'undefined' || errMode[0]?.code === 'invalid_type'
      ? 'Missing'
      : 'Wrong';

  return {
    message: `${capitalizedFields} is ${prefix}`,
    statusCode: StatusCodes.BAD_REQUEST,
  };
};
