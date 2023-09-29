import { Alert } from "reactstrap";
/** Component for showing bootstrap-style alerts.
 *
 * { LoginForm, SignupForm, ProfileForm } -> Alert
 **/

function AlertMessage({ color = "danger", messages = [] }) {
	console.debug("Alert", "color=", color, "messages=", messages);

	return (
		<Alert color={color} className="p-1" role="alert">
			{messages.map((error) => (
				<p className="mb-0 small" key={error}>
					{error}
				</p>
			))}
		</Alert>
	);
}

export default AlertMessage;
