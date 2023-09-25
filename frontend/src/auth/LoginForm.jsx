import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label, Input, FormGroup, Form } from "reactstrap";
import Alert from "../common/AlertMessage";

/** Login form.
 *
 * Shows form and manages update to state on changes.
 * On submission:
 * - calls login function prop
 * - redirects to /companies route
 *
 * Routes -> LoginForm -> Alert
 * Routed as /login
 */

function LoginForm({ login }) {
	function onSubmit(formData) {
		console.log(formData);
	}

	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [formErrors, setFormErrors] = useState([]);

	console.debug(
		"LoginForm",
		"login=",
		typeof login,
		"formData=",
		formData,
		"formErrors",
		formErrors
	);

	/** Handle form submit:
	 *
	 * Calls login func prop and, if successful, redirect to /companies.
	 */

	async function handleSubmit(evt) {
		evt.preventDefault();
		let result = await login(formData);
		if (result.success) {
			navigate("/");
		} else {
			setFormErrors(result.errors);
		}
	}

	/** Update form data field */
	function handleChange(evt) {
		const { name, value } = evt.target;
		setFormData((data) => ({ ...data, [name]: value }));
	}

	return (
		<div className="LoginForm">
			<div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
				<h3 className="mb-3">Log In</h3>

				<div className="card shadow-sm">
					<div className="card-body">
						<Form onSubmit={handleSubmit}>
							<FormGroup floating>
								<Input
									name="username"
									id="username"
									placeholder="username"
									value={formData.username}
									onChange={handleChange}
									required
								/>
								<Label htmlFor="username">Username</Label>
							</FormGroup>

							<FormGroup floating>
								<Input
									name="password"
									id="password"
									placeholder="password"
									value={formData.password}
									onChange={handleChange}
									type="password"
									required
								/>
								<Label htmlFor="password">Password</Label>
							</FormGroup>

							{formErrors.length ? <Alert messages={formErrors} /> : null}

							<button className="btn btn-primary" onSubmit={handleSubmit}>
								Submit
							</button>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoginForm;
