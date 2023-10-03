import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { momentGetApi } from "../api";
import { Container } from "reactstrap";
import MomentCard from "./MomentCard";
import AlertMessage from "../common/AlertMessage";
import LoadingSpinner from "../common/LoadingSpinner";
import MomentContext from "./MomentContext";

const MomentView = () => {
	const { momentId } = useParams();
	const [moment, setMoment] = useState(null);
	const [errors, setErrors] = useState(null);

	useEffect(() => {
		async function fetchMoment() {
			try {
				setMoment(await momentGetApi(momentId));
			} catch (err) {
				setErrors(err);
			}
		}
		fetchMoment();
	}, [momentId]);

	if (!moment) {
		return (
			<>{errors ? <AlertMessage messages={errors} /> : <LoadingSpinner />}</>
		);
	}

	return (
		<div>
			<MomentContext.Provider value={{ moment, setMoment }}>
				<Container className="container col-md-6  col-lg-6">
					<MomentCard moment={moment} dropdown={true} />
					{/* {errors && <AlertMessage messages={errors} />} */}
				</Container>
			</MomentContext.Provider>
		</div>
	);
};

export default MomentView;
