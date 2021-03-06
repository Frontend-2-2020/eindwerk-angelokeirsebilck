import { API } from '../../config/API';

export const loginAction = (loginValues,history) => dispatch => {
    API.post("oauth/token", loginValues).then(response => {
        // Als die call lukt doen we 3 dingen:

        // We slaan de token op in localstorage, dit zodat we na het herladen van de pagina nog steeds verder kunnen
        // met deze token. In API.js stellen we deze token onmiddellijk in bij het inladen van de pagina als deze
        // beschikbaar is
        window.localStorage.setItem("LOGIN_OAUTHTOKEN", response.data.access_token);

        // Om vanaf nu onze API requests te voorzien van een token moeten we dit als volgt instellen.
        // Volgende refresh is dit niet meer nodig want dan doen we exact dit in de API.js
        API.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token;

        // Na het juist instellen van alles kunnen we gaan ophalen wie er is ingelogd om dit dan weer te geven op
        // de pagina
        dispatch(setUserData());
        history.push("/");
    });
}

export const logoutAction = () => dispatch => {
    // Ook bij logout doen we eigenlijk 3 dingen, namelijk het omgekeerde van de login.
    // We verwijderen de token uit localstorage, zodanig dat een user niet opnieuw is ingelogd na een page refresh
    window.localStorage.setItem("LOGIN_OAUTHTOKEN", undefined);

    // We verwijderen de token uit onze API calls voor de huidige sessie.
    API.defaults.headers.common['Authorization'] = undefined;

    // We verwijderen de user uit de state
    dispatch(deleteUserData());
}

export const registerAction = (registerValues, history) => {
    API.post("api/users", registerValues).then(response => {
        //Redirect naar login page
        history.push("/login");
    });
}

export const deleteUserData = () => {
    return {
        type: "DELETE_USER_DATA"
    }
}

export const setUserData = () => {
    return function (dispatch) {
        API.get("api/user").then(response => {
            dispatch({
                type: "SET_USER_DATA",
                payload: response.data
            });
        }).catch(function (error) {
            // handle error
            console.log(error);
        })
    }
}
