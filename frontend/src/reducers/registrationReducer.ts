interface RegistrationState {
  loading: boolean;
  error: string | null;
  userData: any;
}

const initialState: RegistrationState = {
  loading: false,
  error: null,
  userData: null,
};

interface Action {
  type: string;
  payload?: any;
}

const registrationReducer = (state = initialState, action: Action): RegistrationState => {
  switch (action.type) {
    case 'REGISTER_REQUEST':
      return { ...state, loading: true };
    case 'REGISTER_SUCCESS':
      return { ...state, loading: false, userData: action.payload };
    case 'REGISTER_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default registrationReducer;
