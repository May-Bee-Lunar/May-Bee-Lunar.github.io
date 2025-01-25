// Tertiary expressions are underrated!

export class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(secondVector2D) {this.x += secondVector2D.x; this.y += secondVector2D.y;} // Adds a vector to this vector
    subtract(secondVector2D) {this.x -= secondVector2D.x; this.y -= secondVector2D.y;} // Subtracts a vector from this vector
    multiply(secondVector2D) {this.x *= secondVector2D.x; this.y *= secondVector2D.y;} // Multiplies this vector with another vector
    divide(secondVector2D) {this.x /= secondVector2D.x; this.y /= secondVector2D.y;} // Divides this vector by another vector
    getSum(secondVector2D) {return new Vector2D(this.x + secondVector2D.x, this.y + secondVector2D.y);} // Returns the sum of two vectors without modifying either
    getDifference(secondVector2D) {return new Vector2D(this.x - secondVector2D.x, this.y - secondVector2D.y);} // Returns the difference of two vectors without modifying either
    getProduct(secondVector2D) {return new Vector2D(this.x * secondVector2D.x, this.y * secondVector2D.y);} // Returns the product of two vectors without modifying either
    getQuotient(secondVector2D) {return new Vector2D(this.x / secondVector2D.x, this.y / secondVector2D.y);} // Returns the quotient of two vectors without modifying either
    invert() {this.x *= -1; this.y *= -1;} // Inverts this vector
    getInvert() {return new Vector2D(this.x *= -1, this.y *= -1);} // Returns a vector the opposite direction of this vector

    getDirectionRad() {return Math.atan2(this.y, this.x);} // Returns the direction pointing from the origin to the vector in radians
    getDirectionDeg() {return radToDeg(this.getDirectionRad());} // Returns the direction pointing from the origin to the vector in degrees
    getMagnitude() {return Math.sqrt(this.x ** 2 + this.y ** 2);} // Returns the distance from the vector to the origin
    getDistance(secondVector2D) {return (this.getDifference(secondVector2D).getMagnitude());} // Returns the distance of two vectors
}

export class Vector3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(secondVector3D) {this.x += secondVector3D.x; this.y += secondVector3D.y; this.z += secondVector3D.z;;} // Adds a vector to this vector
    subtract(secondVector3D) {this.x -= secondVector3D.x; this.y -= secondVector3D.y; this.z -= secondVector3D.z;} // Subtracts a vector from this vector
    multiply(secondVector3D) {this.x *= secondVector3D.x; this.y *= secondVector3D.y; this.z *= secondVector3D.z;} // Multiplies this vector with another vector
    divide(secondVector3D) {this.x /= secondVector3D.x; this.y /= secondVector3D.y; this.z /= secondVector3D.z;} // Divides this vector by another vector
    getSum(secondVector3D) {return new Vector3D(this.x + secondVector3D.x, this.y + secondVector3D.y, this.z + secondVector3D.z);} // Returns the sum of two vectors without modifying either
    getDifference(secondVector3D) {return new Vector3D(this.x - secondVector3D.x, this.y - secondVector3D.y, this.z - secondVector3D.z);} // Returns the difference of two vectors without modifying either
    getProduct(secondVector3D) {return new Vector3D(this.x * secondVector3D.x, this.y * secondVector3D.y, this.z * secondVector3D.z);} // Returns the product of two vectors without modifying either
    getQuotient(secondVector3D) {return new Vector3D(this.x / secondVector3D.x, this.y / secondVector3D.y, this.z / secondVector3D.z);} // Returns the quotient of two vectors without modifying either
    invert() {this.x *= -1; this.y *= -1; this.z *= -1;} // Inverts this vector
    getInvert() {return new Vector3D(this.x *= -1, this.y *= -1, this.z *= -1)} // Returns a vector the opposite direction of this vector

    getXZPosition() {return new Vector2D(this.x, this.z);} // Returns a 2D vector with the x and z coordinates of this vector

    isCollidingBox(box) {return this.x > box.position3D.x && this.x < box.position3D.x + box.size3D.x && this.y > box.position3D.y && this.y < box.position3D.y + box.size3D.y && this.z > box.position3D.z && this.z < box.position3D.z + box.size3D.z;}

    isCollidingCylinder(cylinder) {
        return this.getXZPosition().getDistance(cylinder.position3D.getXZPosition()) < cylinder.radius && this.y > cylinder.position3D.y && this.y < cylinder.position3D.y + cylinder.height
    }
}

export class cylinder {
    constructor(position3D, radius, height) {
        this.position3D = position3D;
        this.radius = radius;
        this.height = height;
    } 

    getColliderType() {return "cylinder";} // Returns collider type. (Cylinder in this case.)

    isCollidingBox(box) {

        let testingPoint = this.position3D.getXZPosition();
        testingPoint.x = testingPoint.x < box.position3D.x ? box.position3D.x : testingPoint.x;
        testingPoint.x = testingPoint.x > box.position3D.x + box.size3D.x ? box.position3D.x + box.size3D.x : testingPoint.x;
        testingPoint.y = testingPoint.y < box.position3D.z ? box.position3D.z : testingPoint.y;
        testingPoint.y = testingPoint.y > box.position3D.z + box.size3D.z ? box.position3D.z + box.size3D.z : testingPoint.y;

        let collidingXZAxes = this.position3D.getXZPosition().getDistance(testingPoint) < this.radius ? true : false;

        let higherCollider = this.position3D.y > box.position3D.y ? this : box;
        let lowerCollider = this.position3D.y < box.position3D.y ? this : box;
        let lowerColliderHeight = lowerCollider.getColliderType() == "cylinder" ? lowerCollider.height : lowerCollider.size3D.y;
        let collidingYAxis = lowerCollider.position3D.y + lowerColliderHeight > higherCollider.position3D.y ? true : false;
        
        return collidingXZAxes && collidingYAxis ? true : false;
    }
    
    isCollidingCylinder(secondCylinder) {

        let cylinder1Position2D = this.position3D.getXZPosition();
        let cylinder2Position2D = secondCylinder.position3D.getXZPosition();
        let collidingXZAxes = cylinder1Position2D.getDistance(cylinder2Position2D) < this.radius + secondCylinder.radius ? true : false;

        let higherCylinder = this.position3D.y > secondCylinder.position3D.y ? this : secondCylinder;
        let lowerCylinder = this.position3D.y < secondCylinder.position3D.y ? this : secondCylinder;
        let collidingYAxis = lowerCylinder.position3D.y + lowerCylinder.height > higherCylinder.position3D.y ? true : false;

        return collidingXZAxes && collidingYAxis ? true : false;
    } // Returns a boolean variable for if this is colliding with another cylinder. If it is just bordering, it will still return false.
}

export class box {
    constructor(position3D, size3D) {
        this.position3D = position3D;
        this.size3D = size3D;
    } 

    getColliderType() {return "box";} // Returns collider type. (Box in this case.)
    
    isCollidingBox(secondBox) {

        let eastMostBox = this.position3D.x > secondBox.position3D.x ? this : secondBox;
        let westMostBox = this.position3D.x < secondBox.position3D.x ? this : secondBox;
        let collidingXAxis = westMostBox.position3D.x + westMostBox.size.x > eastMostBox.position3D.x ? true : false;

        let higherBox = this.position3D.y > secondBox.position3D.y ? this : secondBox;
        let lowerBox = this.position3D.y < secondBox.position3D.y ? this : secondBox;
        let collidingYAxis = lowerBox.position3D.y + lowerBox.size.y > higherBox.position3D.y ? true : false;

        let southMostBox = this.position3D.z > secondBox.position3D.z ? this : secondBox;
        let northMostBox = this.position3D.z < secondBox.position3D.z ? this : secondBox;
        let collidingZAxis = northMostBox.position3D.z + northMostBox.size.z > southMostBox.position3D.z ? true : false;

        return collidingXAxis && collidingYAxis && collidingZAxis ? true : false;
    } // Returns a boolean variable for if this is colliding with another box. If it is just bordering, it will still return false.
}

export function degToRad(degrees) {return degrees * (Math.PI / 180);} // Returns the angle in radians
export function radToDeg(rad) {return rad * (180 / Math.PI);} // Returns the angle in degrees
export let tau = 2 * Math.PI;
export let aPrettySmallNumber = 0.01; // idk, floating point is jank at times, so I put a pretty small number to fix it.