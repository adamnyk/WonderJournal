import React, { useState, useEffect } from "react";


function SearchForm({ searchFor }) {
	console.debug("SearchForm", "searchFor=", typeof searchFor);

	const [searchTerm, setSearchTerm] = useState("");

	/** Tell parent to filter */
	// take care of accidentally trying to search for just spaces

	useEffect(() => {
		searchFor(searchTerm.trim() || undefined);
	}, [searchTerm]);

	/** Update form fields */
	function handleChange(e) {
		setSearchTerm(e.target.value);
	}
	// search();

	return (
		<div className="SearchForm mb-4">
			{/* <form className="form-inline" onSubmit={handleSubmit}> */}
			<input
				className="form-control form-control-sm flex-grow-1 "
				name="searchTerm"
				placeholder="Enter search term.."
				value={searchTerm}
				onChange={handleChange}
			/>
			{/* <button type="submit" className="btn btn-sm btn-primary ml-1">
            Submit
          </button>
        </form> */}
		</div>
	);
}

export default SearchForm;
