
class Hat {
  
    width: number;
    height: number;
    game: MainGame;

    constructor(game: MainGame) {
        this.game = game
        this.width = 0
        this.height = 0

    }


    initialize(height: number, width: number) {
        const material0 = Material.of(0.0, 0.0, 0.0);
    
        const origin_move = 0.2 * height;
        const wall_thickness = 0.05 * width;  // Wall thickness scaled by width
        const wall_height = 0.3 * height;     // Height of the vertical walls scaled by height
        const lip_height = 0.05 * height;     // Height of the lip at the top of the walls
        const lip_outward = 0.10 * width;     // How much the lip extends outward, scaled by width
        
        const bottom_Polygon = [
            Vector2D.cartesian(0.25 * width, 0.05 * height - origin_move), 
            Vector2D.cartesian(-0.25 * width, 0.05 * height - origin_move), 
            Vector2D.cartesian(-0.25 * width, -0.05 * height - origin_move), 
            Vector2D.cartesian(0.25 * width, -0.05 * height - origin_move)
        ];
    
        // Right side polygon defined counter-clockwise
        const right_side_Polygon = [
            Vector2D.cartesian((0.25 - 0.05) * width, -0.05 * height - origin_move - wall_height),
            Vector2D.cartesian(0.25 * width, -0.05 * height - origin_move - wall_height),  
            Vector2D.cartesian(0.25 * width, -0.05 * height - origin_move), 
            Vector2D.cartesian((0.25 - 0.05) * width, -0.05 * height - origin_move),  
        ];
    
        // Left side polygon defined counter-clockwise
        const left_side_Polygon = [
            Vector2D.cartesian(-0.25 * width, -0.05 * height - origin_move - wall_height),
            Vector2D.cartesian((-0.25 + 0.05) * width, -0.05 * height - origin_move - wall_height), 
            Vector2D.cartesian((-0.25 + 0.05) * width, -0.05 * height - origin_move), 
            Vector2D.cartesian(-0.25 * width, -0.05 * height - origin_move)
        ];
    
        // Lips for right and left sides
        const right_lip_Polygon = [
            Vector2D.cartesian(0.25 * width, -0.05 * height - origin_move - wall_height),
            Vector2D.cartesian((0.25 + 0.10) * width, -0.05 * height - origin_move - wall_height),
            Vector2D.cartesian((0.25 + 0.10) * width, -0.05 * height - origin_move - wall_height - lip_height),
            Vector2D.cartesian(0.25 * width, -0.05 * height - origin_move - wall_height - lip_height)
        ];
    
        const left_lip_Polygon = [
            Vector2D.cartesian((-0.25 - 0.10) * width, -0.05 * height - origin_move - wall_height),
            Vector2D.cartesian(-0.25 * width, -0.05 * height - origin_move - wall_height),
            Vector2D.cartesian(-0.25 * width, -0.05 * height - origin_move - wall_height - lip_height),
            Vector2D.cartesian((-0.25 - 0.10) * width, -0.05 * height - origin_move - wall_height - lip_height)
        ];
    
        const hat_bottom = Body.of(this.game.physicsEngine);
        hat_bottom.position.set(Vector2D.cartesian(1,10));
        hat_bottom.setTrueVelocity(Vector2D.cartesian(0, 0));
        hat_bottom.setTrueAcceleration(Vector2D.cartesian(0, -9.81));
        hat_bottom.angularLightness = 0.1;
    
        // Add polygons to the hat
        hat_bottom.polygons.push(PhysicalPolygon.of(TransformedConvexPolygon.of(bottom_Polygon), material0));
        hat_bottom.polygons.push(PhysicalPolygon.of(TransformedConvexPolygon.of(right_side_Polygon), material0));
        hat_bottom.polygons.push(PhysicalPolygon.of(TransformedConvexPolygon.of(left_side_Polygon), material0));
        hat_bottom.polygons.push(PhysicalPolygon.of(TransformedConvexPolygon.of(right_lip_Polygon), material0));
        hat_bottom.polygons.push(PhysicalPolygon.of(TransformedConvexPolygon.of(left_lip_Polygon), material0));
    
        this.game.physicsEngine.bodies.push(hat_bottom)
    }
    
    

}