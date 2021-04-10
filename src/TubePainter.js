import {
	BufferAttribute,
	BufferGeometry,
	Color,
	DynamicDrawUsage,
	Matrix4,
	Mesh,
	MeshStandardMaterial,
	Vector3,
	MeshBasicMaterial
} from 'three';

function TubePainter() {

	// const BUFFER_SIZE = 1000000 * 3;
	const BUFFER_SIZE = 40000;

	const positions = new BufferAttribute( new Float32Array( BUFFER_SIZE ), 3 );
	positions.usage = DynamicDrawUsage;

	const geometry = new BufferGeometry();
	geometry.setAttribute( 'position', positions );
	geometry.drawRange.count = 0;

	const material = new MeshBasicMaterial({color:0x3366cc})
	const mesh = new Mesh( geometry, material );
	mesh.frustumCulled = false;

	//

	function getPoints( size ) {

		const PI2 = Math.PI * 2;

		const sides = 10;
		const array = [];
		const radius = 0.01 * size;

		for ( let i = 0; i < sides; i ++ ) {

			const angle = ( i / sides ) * PI2;
			array.push( new Vector3( Math.sin( angle ) * radius, Math.cos( angle ) * radius, 0 ) );

		}

		return array;

	}

	//

	const vector1 = new Vector3();
	const vector2 = new Vector3();
	const vector3 = new Vector3();
	const vector4 = new Vector3();

	const color = new Color('#ffffff');
	let size = 1;

	function stroke( position1, position2, matrix1, matrix2 ) {

		if ( position1.distanceToSquared( position2 ) === 0 ) return;

		let count = geometry.drawRange.count;

		const points = getPoints( size );

		for ( let i = 0, il = points.length; i < il; i ++ ) {

			const vertex1 = points[ i ];
			const vertex2 = points[ ( i + 1 ) % il ];

			// positions

			vector1.copy( vertex1 ).applyMatrix4( matrix2 ).add( position2 );
			vector2.copy( vertex2 ).applyMatrix4( matrix2 ).add( position2 );
			vector3.copy( vertex2 ).applyMatrix4( matrix1 ).add( position1 );
			vector4.copy( vertex1 ).applyMatrix4( matrix1 ).add( position1 );

			vector1.toArray( positions.array, ( count + 0 ) * 3 );
			vector2.toArray( positions.array, ( count + 1 ) * 3 );
			vector4.toArray( positions.array, ( count + 2 ) * 3 );

			vector2.toArray( positions.array, ( count + 3 ) * 3 );
			vector3.toArray( positions.array, ( count + 4 ) * 3 );
			vector4.toArray( positions.array, ( count + 5 ) * 3 );

			count += 6;

		}

		geometry.drawRange.count = count;

	}

	//

	const up = new Vector3( 0, 1, 0 );

	const point1 = new Vector3();
	const point2 = new Vector3();

	const matrix1 = new Matrix4();
	const matrix2 = new Matrix4();

	function moveTo( position ) {

		point1.copy( position );
		matrix1.lookAt( point2, point1, up );

		point2.copy( position );
		matrix2.copy( matrix1 );

	}

	function lineTo( position ) {

		point1.copy( position );
		matrix1.lookAt( point2, point1, up );

		stroke( point1, point2, matrix1, matrix2 );

		point2.copy( point1 );
		matrix2.copy( matrix1 );

	}

	function setSize( value ) {

		size = value;

	}

	//

	let count = 0;

	function update() {

		const start = count;
		const end = geometry.drawRange.count;

		if ( start === end ) return;

		positions.updateRange.offset = start * 3;
		positions.updateRange.count = ( end - start ) * 3;
		positions.needsUpdate = true;

		count = geometry.drawRange.count;

	}

	return {
		mesh: mesh,
		moveTo: moveTo,
		lineTo: lineTo,
		setSize: setSize,
		update: update
	};

}

export { TubePainter };