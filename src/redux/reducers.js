// reducers.js

const initialState = {
  token: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload,
      };

    // Add other cases for different actions if needed

    default:
      return state;
  }
};

export default rootReducer;
