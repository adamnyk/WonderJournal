import {
	Container,
	CardBody,
	Card,
	CardText,
	CardHeader,
	CardFooter,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from "reactstrap";
import formatDate from "../helpers/formatDate";
import TagBadge from "../common/TagBadge";
import { useState } from "react";

const MomentCard = ({ moment }) => {
	const { id, title, text, date, tags } = moment;

	const [dropdownOpen, setDropdownOpen] = useState(false);

	const toggle = () => setDropdownOpen((prevState) => !prevState);

	return (
		<Card color="light" className="mb-2 shadow-sm">
			<CardHeader className="pb-0">
				<div className="h4 m-0">{title} This is the story...</div>
				<div className="small float-right">{formatDate(date)}</div>
			</CardHeader>
			<CardBody>
				<CardText className="text-left">
					{text} Journaling... this is the sample text. Lorem ipsum dolor sit
					amet consectetur adipisicing elit. Obcaecati neque voluptatem aut eius
					fugiat. Atque doloremque dicta architecto adipisci! Cum esse
					voluptates nostrum similique pariatur earum incidunt dolore ut
					consectetur? Lorem ipsum dolor sit, amet consectetur adipisicing elit.
					Illum, quisquam, animi quammus veritatis placeat. Lorem ipsum dolor,
					sit amet consectetur adipisicing elit. Voluptatum delectus architecto
					repellendus incidunt, aspernatur atque! Labore consequuntur facere
					odit sit, iste debitis magnam, t corporis amet quibusdam excepturi
					dolore maiores, mollitia nostrum reiciendis perferendis voluptatum.
					Blanditiis unde quod pariatur possiemporibus eius quisquam accusantium
					saepe, quia praesentium.
				</CardText>
			</CardBody>

			<CardFooter className="pb-1 pt-0 text-left">
				{tags.map((tag) => (
					<TagBadge tag={tag} key={tag.id} />
				))}
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

					<DropdownMenu>
						<DropdownItem header>Header</DropdownItem>
						<DropdownItem>Some Action</DropdownItem>
						<DropdownItem text>Dropdown Item Text</DropdownItem>
						<DropdownItem disabled>Action (disabled)</DropdownItem>
						<DropdownItem divider />
						<DropdownItem>Foo Action</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</CardFooter>
		</Card>
	);
};

export default MomentCard;
