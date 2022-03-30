import React from 'react';

const SearchCharacters = (props) => {
	const handleChange = (e) => {
		props.searchValue(e.target.value);
	};
	return (
		<form
			method='POST'
			onSubmit={(e) => {
				e.preventDefault();
			}}
			name='formName'
			className='searchBar'
		>
			<label>
				<span>Search Shows: </span>
				<input autoComplete='off' type='text' name='searchTerm' className='searchBox' onChange={handleChange} />
			</label>
		</form>
	);
};

export default SearchCharacters;