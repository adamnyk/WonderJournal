import { useState, useEffect } from "react";
import { setApiToken, signupApi, loginApi, getUser } from "./api";
import jwt_decode from "jwt-decode";
import WJRoutes from "./common/WJRoutes";
import NavBar from "./common/NavBar";
import useLocalStorage from "./hooks/useLocalStorage";
import UserContext from "./UserContext";
import LoadingSpinner from "./common/LoadingSpinner";
import "./App.css";

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "wonderJournal-token";

function App() {
	const [currentUser, setCurrentUser] = useState(null);
	const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
	const [infoLoaded, setInfoLoaded] = useState(false);

	useEffect(
		function loadUserInfo() {
			console.debug("App useEffect loadUserInfo", "token=", token);
			async function getCurrentUser() {
				if (token) {
					try {
						const { username } = jwt_decode(token);
						setApiToken(token);
						setCurrentUser(await getUser(username));
					} catch (err) {
						console.error("App: Error loading user", err);
						setCurrentUser(null);
					}
				} else {
					setCurrentUser(null);
				}
				setInfoLoaded(true);
			}
			setInfoLoaded(false);
			getCurrentUser();
		},
		[token]
	);

	/** Handles site-wide signup.
	 *
	 * Automatically logs them in (set token) upon signup.
	 */
	async function signup(signupData) {
		try {
			let token = await signupApi(signupData);
			setToken(token);
			return { success: true };
		} catch (errors) {
			console.error("signup failed", errors);
			return { success: false, errors };
		}
	}
	/** Handles site-wide login.
	 *
	 * Make sure you await this function and check its return value!
	 */
	async function login(loginData) {
		try {
			let token = await loginApi(loginData);
			setToken(token);
			return { success: true };
		} catch (errors) {
			console.error("login failed", errors);
			return { success: false, errors };
		}
	}

	/** Handles site-wide logout. */
	function logout() {
		setCurrentUser(null);
		setToken(null);
	}

	if (!infoLoaded) return <LoadingSpinner className="mt-5" />;
	return (
		<UserContext.Provider value={{ currentUser, setCurrentUser }}>
			<NavBar logout={logout} />
			<WJRoutes login={login} signup={signup} />
		</UserContext.Provider>
	);
}

export default App;
