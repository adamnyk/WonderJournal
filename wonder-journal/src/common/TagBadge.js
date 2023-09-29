const TagBadge = ({ tag }) => {
	const { id, name } = tag;
	return (
		<a href="/tags/{id}" className="badge badge-secondary mx-1 text-light">
			{name}
		</a>
	);
};

export default TagBadge;
