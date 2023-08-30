//this file will hold an object to return products
import bcrypt from 'bcryptjs';

const data = {
	users: [
		{
			name: 'Will',
			email: 'admin@example.com',
			password: bcrypt.hashSync('123456'),
			isAdmin: true,
		},
		{
			name: 'John',
			email: 'user@example.com',
			password: bcrypt.hashSync('123456'),
			isAdmin: false,
		},
	],

	products: [
		{
			//_id: '1',
			name: 'Nike Slim Shirt',
			slug: 'nike-slim-shirt',
			image: '/images/p1.webp', //all images are 679px x 829px
			brand: 'Nike',
			category: 'Shirts',
			description: 'high quality shirt',
			price: 120,
			countInStock: 10,
			rating: 4.5,
			numReviews: 10,
		},
		{
			//_id: '2',
			name: 'Addidas Fit Shirt',
			slug: 'addidas-fit-shirt',
			image: '/images/p2.webp',
			brand: 'Addidas',
			category: 'Shirts',
			description: 'high quality product',
			price: 150,
			countInStock: 0,
			rating: 3.5,
			numReviews: 9,
		},
		{
			//_id: '3',
			name: 'Nike Slim Pants',
			slug: 'nike-slim-pants',
			image: '/images/p3.webp',
			brand: 'Nike',
			category: 'Pants',
			description: 'high quality product',
			price: 230,
			countInStock: 10,
			rating: 4.8,
			numReviews: 15,
		},
		{
			//_id: '4',
			name: 'Addidas Fit Pants',
			slug: 'addidas-fit-pants',
			image: '/images/p4.webp',
			brand: 'Addidas',
			category: 'Pants',
			description: 'high quality pants',
			price: 249,
			countInStock: 9,
			rating: 4.8,
			numReviews: 18,
		},
	],
};

export default data;
