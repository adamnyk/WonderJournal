import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { momentGetAllApi } from "../api";
import { Container } from "reactstrap";
import MomentCard from "./MomentCard";
import AlertMessage from "../common/AlertMessage";
import LoadingSpinner from "../common/LoadingSpinner";

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

	if (!moments) {
		return (
			<>{errors ? <AlertMessage messages={errors} /> : <LoadingSpinner />}</>
		);
	}

	return (
		<div>
			<Container className="container col-md-6  col-lg-6">
				Moments
			</Container>
		</div>
	);
};

export default MomentViewAll;
