import React from 'react';
import { useParams } from 'react-router-dom';

const ProductScreen = () => {
	//the slug params aka link suffix gets saved as the variable params
	const params = useParams();
	// the slug paams used in the link gets saved into the slug variable, where it is used below that
	const { slug } = params;
	return (
		<div>
			<h1>{slug}</h1>
		</div>
	);
};

export default ProductScreen;
