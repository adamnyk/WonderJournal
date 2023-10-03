import { useState, useContext } from "react";
import {
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Form,
	Input,
	InputGroup,
	Label,
	Button,
} from "reactstrap";
import TagBadge from "../common/TagBadge";
import MomentContext from "../moments/MomentContext";
import { addNewMomentTagApi } from "../api";

export const TagAddDropdownForm = ({ momentTags, momentId, addNewTag }) => {
	const { setMoment } = useContext(MomentContext);

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [formData, setFormData] = useState({
		tagName: "",
	});
	const [formErrors, setFormErrors] = useState([]);

	const toggle = () => setDropdownOpen((prevState) => !prevState);

	function handleChange(evt) {
		const { name, value } = evt.target;
		setFormData((data) => ({ ...data, [name]: value }));
	}

	const handleSubmit = async (evt) => {
		evt.preventDefault();
		if (formData.tagName.length) {
			try {
				const { id, name } = await addNewMomentTagApi(momentId, formData);
				setMoment((m) => ({ ...m, tags: [...m.tags, { id, name }] }));
			} catch (err) {
				setFormErrors(err);
			}
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
				{/* {momentTags.map((tag) => (
					<TagBadge tag={tag} key={tag.id} />
				))}
				<DropdownItem divider /> */}
				<Form onSubmit={handleSubmit} className="m-1">
					<InputGroup size="sm">
						<Input
							id="tagName"
							name="tagName"
							placeholder="New tag"
							onChange={handleChange}
							className="form-control"
						/>
						<Label hidden htmlFor="tagName">
							Tag Name
						</Label>
						<Button color="outline-primary" className="form-control p-0">
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
