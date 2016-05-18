module example_hinge() {
    translate([0,0,6]) {
        horizontal_pin_with_5_fingers(25, 3);
        translate([5.5,0,-0.5*(6+2.25)]) #cube([10, 30, 3], center=true);
        translate([-5.5,0,-0.5*(6+2.25)]) cube([10, 30, 3], center=true);
    }
}

function debugprint(s) = search(s, []);

module chamfered_cube(dims, chamfer, center=true) {
    w=dims[0]; l=dims[1]; h=dims[2];
    linear_extrude(height=h,twist=0,center=center) {
        offset(r=chamfer) {
          square([w-chamfer*2,l-chamfer*2], center=center);
        }
    }
}

module countersink_ends(h, radius, pin_radius) {
    union() {
        chamfer = pin_radius*1.5;
        // chamfer the pin hole at each end
        translate([0,0,pin_radius/2]) #cylinder(r1=chamfer, r2=pin_radius, h=pin_radius, center=true);
        translate([0,0,h-pin_radius/2]) #cylinder(r1=pin_radius, r2=chamfer, h=pin_radius, center=true);
    }
}

module pin_hinge_unit(h, radius, pin_radius=1.5, index=0, gap=0.5) {
    $fn=30;
    translate([0,radius-gap,0]) difference() {
        // the barrel+lug
        hull() {
            cylinder(r=radius, h=h, center=true);
            translate([index%2>0 ? radius*0.875 : radius*-0.875, radius/2+gap*2, 0]) {
                cube([radius+gap,gap,h], center=true);
            }
        }
        // the hole for the pin
        #cylinder(r=pin_radius, h=h, center=true);
    }
}


module pin_hinge(h, radius, fingers=3, pin_radius=1.5, gap=0.5) {
    total_gap=(fingers-1)*gap;
    unit_h=(h-total_gap)/fingers;
    translate([0,0,unit_h/2]) union() {
        for(i=[0:fingers-1]) {
            translate([0,0, gap*i+i*unit_h]) pin_hinge_unit(unit_h, radius, pin_radius, i);
        }
    }
}

module horizontal_pin_with_5_fingers(length, radius=3, pin_r=1) {
    translate([0,-length/2,3]) rotate([-90,0,0]) pin_hinge(length, radius, 5);
}

