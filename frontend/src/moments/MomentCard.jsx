import { useState, useEffect } from "react";
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

const MomentCard = ({ moment, dropdown = false }) => {
	const { id, title, text, date, tags } = moment;

	return (

				<Card color="light" className="mb-2 shadow-sm">
					<CardHeader className="pb-0">
						<div className="h4 m-0">{title}</div>
						<div className="small float-right">{formatDate(date)}</div>
					</CardHeader>
					<CardBody>
						<CardText className="text-left">{text}</CardText>
					</CardBody>

					{tags && (
						<CardFooter className="pb-1 pt-0 text-left">
							{tags.map((tag) => (
								<TagBadge tag={tag} key={tag.id} />
							))}
							{dropdown && (
								<TagAddDropdownForm momentTags={tags} momentId={id} />
							)}
						</CardFooter>
					)}
				</Card>
	);
};

export default MomentCard;
