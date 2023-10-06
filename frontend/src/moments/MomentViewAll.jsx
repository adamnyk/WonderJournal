import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { momentGetAllApi } from "../api";
import { Container } from "reactstrap";
import {debounce} from "debounce"

import AlertMessage from "../common/AlertMessage";
import LoadingSpinner from "../common/LoadingSpinner";
import MomentCard from "./MomentCard";
import SearchForm from "../forms/SearchForm";

const MomentViewAll = () => {
	const [moments, setMoments] = useState(null);
	const [errors, setErrors] = useState(null);

	useEffect(() => {
		async function fetchMoments() {
			try {
				setMoments(await momentGetAllApi());
			} catch (err) {
				setErrors(err);
			}
		}
		fetchMoments();
	}, []);

	/** Triggered by search form submit; reloads moments. */
	async function search(title) {
		let moments = await momentGetAllApi(title);
		setMoments(moments);
	}

	const debounceSearch =  debounce(search, 500)

	if (!moments) {
		return (
			<>{errors ? <AlertMessage messages={errors} /> : <LoadingSpinner />}</>
		);
	}

	return (
		<div className="MomentViewAll">
			<Container className="container col-md-8  col-lg-6">
				<SearchForm searchFor={debounceSearch} />
				{moments.length ? (
					<div>
						{moments.map((m) => (
							<MomentCard moment={m} key={m.id} />
						))}
					</div>
				) : (
					<p className="lead">Sorry, no moments were found.</p>
				)}
			</Container>
		</div>
	);
};

export default MomentViewAll;
