import { useState } from "react";
import {
	Container,
	CardBody,
	Card,
	CardText,
	CardHeader,
	CardFooter,
} from "reactstrap";
import formatDate from "../helpers/formatDate";
import TagBadge from "../common/TagBadge";
import { TagAddDropdownForm } from "../forms/TagAddDropdownForm";

const MomentCard = ({ moment }) => {
	const { id, title, text, date, tags } = moment;



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
				<TagAddDropdownForm tags={tags} momentId={id}/>
			</CardFooter>
		</Card>
	);
};

export default MomentCard;
