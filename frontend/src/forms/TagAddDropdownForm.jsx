import { useState } from "react";
import {
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	Form,
	Input,
	InputGroup,
	Label,
	Button,
} from "reactstrap";

export const TagAddDropdownForm = ({ tags, momentId }) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
	});
	const [formErrors, setFormErrors] = useState([]);

	const toggle = () => setDropdownOpen((prevState) => !prevState);

	function handleChange(evt) {
		const { name, value } = evt.target;
		setFormData((data) => ({ ...data, [name]: value }));
	}

	const handleSubmit = (evt) => {
		evt.preventDefault();
		try {
			// await momentCreateApi(formData);
			navigate("/");
		} catch (err) {
			setFormErrors(err);
		}
	};

	return (
		<Dropdown
			className="float-right"
			small="true"
			isOpen={dropdownOpen}
			toggle={toggle}
			direction="left"
		>
			<DropdownToggle tag="span" className="">
				<a className="fa-solid fa-circle-plus align-middle text-secondary"></a>
			</DropdownToggle>

			<DropdownMenu className="py-1">
				<Form onSubmit={handleSubmit} className="m-1">
					<InputGroup className=" input-group-sm ">
						<Input
							id="tagName"
							name="name"
							placeholder="New tag"
							onChange={handleChange}
							className="form-control"
						/>
						<Label hidden htmlFor="tagName">
							Tag Name
						</Label>
						<Button color="outline-primary" className="form-control btn-sm">
							Add
						</Button>
					</InputGroup>
					{/* <a className="badge btn-badge badge-primary text-light rounded-pill">
						Add tag
					</a> */}
				</Form>
			</DropdownMenu>
		</Dropdown>
	);
};
