export const LoginActionTypes = {
  SET_API_TOKEN: 'set-api-token'
};

export function setApiToken(apiToken) {
  return (dispatch) => {
    dispatch({
      type: LoginActionTypes.SET_API_TOKEN,
      payload: apiToken
    });
  };
}
