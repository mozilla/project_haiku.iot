    
function debugprint(s) = search(s, []);

module chamfered_cube(dims, chamfer) {
    w=dims[0]; l=dims[1]; h=dims[2];
    linear_extrude(height=h,twist=0,center=true) {
        offset(r=chamfer) {
          square([w-chamfer*2,l-chamfer*2], center=true);
        }
    }
}

module pin_hinge(h, radius, pin_radius=1.5, fingers=3) {
    gap=0.75;
    total_gap=(fingers-1)*gap;
    unit_h=(h-total_gap)/fingers;
    $fn=30;
    difference() {
        translate([0,0,unit_h/2]) union() {
            for(i=[0:fingers-1]) {
                // the hinge 'finger' cylinder
                translate([0,0, gap*i+i*unit_h]) cylinder(r=radius, h=unit_h, center=true);
                // the lug for each 'finger'
                if (i%2>0) {
                    translate([radius,radius*0.5-gap,gap*i+i*unit_h]) {
                        #chamfered_cube([radius, radius*1.5, unit_h], 1);
                    }
                } else {
                    translate([-radius,radius*0.5-gap,gap*i+i*unit_h]) {
                        #chamfered_cube([radius, radius*1.5, unit_h], 1);
                    }
                }
            }
        }
        union() {
            chamfer = pin_radius+1;
            // the hole for the pin
            translate([0,0, h/2]) #cylinder(r=pin_radius, h=h, center=true);
            // chamfer the pin hole at each end
            translate([0,0,pin_radius/2]) #cylinder(r1=chamfer, r2=pin_radius, h=pin_radius, center=true);
            translate([0,0,h-pin_radius/2]) #cylinder(r1=pin_radius, r2=chamfer, h=pin_radius, center=true);
        }
    }
    difference() {
        // the wall we attach the hinge lugs to
        translate([0,radius*0.5,h/2]) cube([radius*4-gap*2,radius,h], center=true);
        translate([0,0,h/2]) cylinder(r=radius+gap,h=h, center=true);
    }

}

module horizontal_pin_with_5_fingers(length, radius=3, pin_r=1) {
    translate([0,-length/2,3]) rotate([-90,0,0]) pin_hinge(length, radius, pin_r, 5);
}

// horizontal_pin_with_5_fingers(25);
