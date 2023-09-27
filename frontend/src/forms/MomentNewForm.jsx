import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../common/AlertMessage";
import {momentCreateApi} from "../api"

import {
	Card,
	CardBody,
	Container,
	FormGroup,
	Input,
	Label,
	Form,
	InputGroup,
	InputGroupText,
	Button,
	CardHeader,
} from "reactstrap";

function MomentNewForm() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		title: "",
		text: "",
		date: "",
	});
	const [formErrors, setFormErrors] = useState([]);

	console.debug(
		"MomentNewForm",

		"formData=",
		formData,
		"formErrors=",
		formErrors
	);

	/** Handle form submit:
	 *
	 * Calls login func prop and, if successful, redirect to /.
	 */

	async function handleSubmit(evt) {
		evt.preventDefault();
		try {
			await momentCreateApi(formData);
			navigate("/");
		} catch (err) {
			setFormErrors(err);
		}
	}

	/** Update form data field */
	function handleChange(evt) {
		const { name, value } = evt.target;
		setFormData((data) => ({ ...data, [name]: value }));
	}

	return (
		<Container className="MomentNewForm  col-sm-8 col-md-6 col-xl-4">
			<Card color="light">
				<CardHeader>
					<h2 className="mb-0">New Moment</h2>
				</CardHeader>
				<CardBody>
					<Form onSubmit={handleSubmit}>
						<div className="mb-3">
							<FormGroup floating>
								<Input
									id="title"
									name="title"
									placeholder="Title"
									value={formData.title}
									onChange={handleChange}
								/>
								<Label for="title">Title</Label>
							</FormGroup>
							<FormGroup floating>
								<Input
									id="text"
									name="text"
									placeholder="Journal here..."
									type="textarea"
									style={{ height: "12rem" }}
									value={formData.text}
									onChange={handleChange}
								/>
								<Label for="text">Journal here...</Label>
							</FormGroup>
							<InputGroup>
								<InputGroupText>Date</InputGroupText>
								<Input
									id="date"
									name="date"
									type="date"
									value={formData.date}
									onChange={handleChange}
								/>
								<Label for="date" hidden>
									Date
								</Label>
							</InputGroup>
						</div>

						{formErrors.length ? (
							<AlertMessage type="danger" messages={formErrors} />
						) : null}

						<Button type="submit">Submit</Button>
					</Form>
				</CardBody>
			</Card>
		</Container>
	);
}

export default MomentNewForm;
