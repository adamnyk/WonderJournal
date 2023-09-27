import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../home/Home";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import NewMomentForm from "../forms/MomentNewForm"
import MomentView from "../moments/MomentView";
import MomentViewAll from "../moments/MomentViewAll"

const WJRoutes = ({ login, signup }) => {
	return (
		<div className="p-3 text-center">
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<LoginForm login={login} />} />
				<Route path="/signup" element={<SignupForm signup={signup} />} />
				<Route path="/moments" element={<MomentViewAll />} />
				<Route path="/moments/new" element={<NewMomentForm />} />
				<Route path="/moments/:momentId" element={<MomentView />} />
				<Route path="*" element={<Navigate replace to="/" />} />
			</Routes>
		</div>
	);
};

export default WJRoutes;
