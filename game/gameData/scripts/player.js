import {Vector2D, Vector3D, cylinder, box, degToRad, radToDeg, tau, aPrettySmallNumber} from "./mathFunctions.js";
export function handlePlayerMovement(player, inputs, colliders) {

    // #region XZ axes
    let playerVelocity2D = new Vector2D(0, 0);
    playerVelocity2D.add(new Vector2D((inputs.left ? -1 : 0) + (inputs.right ? 1 : 0), (inputs.up ? -1 : 0) + (inputs.down ? 1 : 0)));
    if (playerVelocity2D.getMagnitude() > 0) {
        playerVelocity2D.multiply(new Vector2D(player.speed / playerVelocity2D.getMagnitude(), player.speed / playerVelocity2D.getMagnitude()));
    }

    player.cylinder.position3D.x += playerVelocity2D.x
    player.cylinder.position3D.z += playerVelocity2D.y
    
    for (let colliderIndex = 0; colliderIndex < colliders.length; colliderIndex++) {
        switch (colliders[colliderIndex].shape.getColliderType()) {
            case "cylinder":
                if (player.cylinder.isCollidingCylinder(colliders[colliderIndex].shape)) {
                    let cylinder = colliders[colliderIndex].shape;
                    let playerPosition2D = player.cylinder.position3D.getXZPosition();
                    let cylinderPosition2D = cylinder.position3D.getXZPosition();

                    let playerNormalForce = playerPosition2D.getDifference(cylinderPosition2D);
                    playerNormalForce.divide(new Vector2D(playerNormalForce.getMagnitude(), playerNormalForce.getMagnitude()));
                    playerNormalForce.multiply(new Vector2D(player.cylinder.radius + cylinder.radius - playerPosition2D.getDistance(cylinderPosition2D), player.cylinder.radius + colliders[colliderIndex].shape.radius - playerPosition2D.getDistance(cylinderPosition2D)));

                    player.cylinder.position3D.add(new Vector3D(playerNormalForce.x, 0, playerNormalForce.y));
                }
                break;
            case "box":
                if (player.cylinder.isCollidingBox(colliders[colliderIndex].shape)) {
                    let box = colliders[colliderIndex].shape;
                    let playerPosition2D = player.cylinder.position3D.getXZPosition();

                    // Testing point is the point on the edge of the rectangle closest to the player.
                    let testingPoint = player.cylinder.position3D.getXZPosition();
                    testingPoint.x = testingPoint.x < box.position3D.x ? box.position3D.x : testingPoint.x;
                    testingPoint.x = testingPoint.x > box.position3D.x + box.size3D.x ? box.position3D.x + box.size3D.x : testingPoint.x;
                    testingPoint.y = testingPoint.y < box.position3D.z ? box.position3D.z : testingPoint.y;
                    testingPoint.y = testingPoint.y > box.position3D.z + box.size3D.z ? box.position3D.z + box.size3D.z : testingPoint.y;

                    let playerNormalForce = playerPosition2D.getDifference(testingPoint);
                    
                    if (playerNormalForce.getMagnitude() == 0) {
                        // In this rare edge case where the player's center is inside the box, testing point is now the closest point for the player.
                        // Well... the closest point on the same x axis and the closest point on the same z axis. In the same vector for some reason. idk :/
                        testingPoint.x = playerPosition2D.x > box.position3D.x + box.size3D.x / 2 ? box.position3D.x + box.size3D.x + player.cylinder.radius : box.position3D.x - player.cylinder.radius;
                        testingPoint.y = playerPosition2D.y > box.position3D.z + box.size3D.z / 2 ? box.position3D.z + box.size3D.z + player.cylinder.radius : box.position3D.z - player.cylinder.radius;

                        if (Math.abs(playerPosition2D.x - testingPoint.x) < Math.abs(playerPosition2D.y - testingPoint.y)) {
                            player.cylinder.position3D.x = testingPoint.x;
                        } else {
                            player.cylinder.position3D.z = testingPoint.y;
                        }
                    } else {
                        playerNormalForce.divide(new Vector2D(playerNormalForce.getMagnitude(), playerNormalForce.getMagnitude()));
                        playerNormalForce.multiply(new Vector2D(player.cylinder.radius - playerPosition2D.getDistance(testingPoint), player.cylinder.radius - playerPosition2D.getDistance(testingPoint)));
                        player.cylinder.position3D.add(new Vector3D(playerNormalForce.x, 0, playerNormalForce.y));
                    }
                }
                
                break;
        }
    }
    // #endregion

    // #region Y axis

    inputs.framesSinceJumpStart++;

    if (player.onGround) {
        if (inputs.framesSinceJumpStart < 8) { // This is done for input buffering! If you press jump a bit too early, it will still register the moment you touch the ground.
            player.onGround = false;
            player.velocityY = 4;
        }
    }

    if (!player.onGround) {
        player.velocityY -= 0.4;
    }

    player.cylinder.position3D.y += player.velocityY;

    if (player.cylinder.position3D.y < 0) {
        player.velocityY = 0;
        player.cylinder.position3D.y = 0;
    }

    let groundBeneathPlayer = false;

    for (let colliderIndex = 0; colliderIndex < colliders.length; colliderIndex++) {
        let groundCheck = new cylinder(player.cylinder.position3D.getDifference(new Vector3D(0, aPrettySmallNumber * 2, 0)), player.cylinder.radius, player.cylinder.height)
        let colliderHeight = 0;
        let colliding = false;
        switch (colliders[colliderIndex].shape.getColliderType()) {
            case "cylinder":
                colliding = player.cylinder.isCollidingCylinder(colliders[colliderIndex].shape);
                groundBeneathPlayer = groundCheck.isCollidingCylinder(colliders[colliderIndex].shape) ? true : groundBeneathPlayer;
                colliderHeight = colliders[colliderIndex].shape.height;
                break;
            case "box":
                colliding = player.cylinder.isCollidingBox(colliders[colliderIndex].shape);
                groundBeneathPlayer = groundCheck.isCollidingBox(colliders[colliderIndex].shape) ? true : groundBeneathPlayer;
                colliderHeight = colliders[colliderIndex].shape.size3D.y;
                break;
        }

        if (colliding) {
            if (colliders[colliderIndex].shape.position3D.y + colliderHeight < player.cylinder.position3D.y - player.velocityY) {
                player.onGround = true;
                player.velocityY = 0;
                player.cylinder.position3D.y = colliders[colliderIndex].shape.position3D.y + colliderHeight + aPrettySmallNumber;
            }
        }
    }
    
    if (!groundBeneathPlayer) {
        player.onGround = false;
    }

    if (player.cylinder.position3D.y <= 0) {
        player.onGround = true;
    }

    // #endregion
}