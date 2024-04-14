class Matrix2By2 {
    column0: Vector2D;
    column1: Vector2D;

	/// Construct this matrix using scalars.
	constructor(a11: number, a12: number, a21: number, a22: number)
	{
        this.column0 = Vector2D.cartesian(a11, a21);
        this.column1 = Vector2D.cartesian(a12, a22);
	}

	/// Solve A * x = b, where b is a column vector. This is more efficient
	/// than computing the inverse in one-shot cases.
	solve(b: Vector2D): Vector2D {
		const a11 = this.column0.x;
        const a12 = this.column1.x;
        const a21 = this.column0.y; 
        const a22 = this.column1.y;
		let det = a11 * a22 - a12 * a21;
		if (det != 0)
		{
			det = 1 / det;
		}
		const x = Vector2D.cartesian(
            det * (a22 * b.x - a12 * b.y), 
            det * (a11 * b.y - a21 * b.x)
        );
		return x;
	}
}