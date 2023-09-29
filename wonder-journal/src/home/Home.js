import { useContext } from "react";
import UserContext from "../UserContext";
import { NavLink } from "react-router-dom";

function Home() {
	const { currentUser } = useContext(UserContext);
	return (
		<>
			<h2>Welcome home!</h2>
			<div>under construction...</div>

			{currentUser && (
				<NavLink className="btn btn-secondary m-3" to="/moments/new">
					Remember that moment...
				</NavLink>
			) }
		</>
	);
}

export default Home;
