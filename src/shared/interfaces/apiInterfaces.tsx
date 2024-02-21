interface apiErrorInterface {
  error: true | false;
  errorMessage: string;
}

type setApiErrorType = React.Dispatch<
  React.SetStateAction<{ error: boolean; errorMessage: string }>
>;

interface apiErrorStateInterface {
  apiError: apiErrorInterface;
  setApiError: setApiErrorType;
}

export type { apiErrorInterface, setApiErrorType, apiErrorStateInterface };
