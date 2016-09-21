use <pin-hinge.scad>;
model_version="UR2 v1.0";
width=40;
half_w=width/2;
length=66;
half_l=length/2;
height=17.5;
lid_height=8;
wall=1;
radius_xy=wall*4;
radius_z=wall*2;
inset=0.75;
strap_height=13;

// debug: check all objects sit on the bed platform
//projection(cut=true) {
translate([width/3,0,-1]) %cube([width*4, length+20, 2], center=true);
union() {
    offset_x=5;
    enclosure_base([-1*(width/2+offset_x),0,height/2+wall/2]);
    enclosure_lid([width/2+offset_x,0,lid_height/2+wall/2]);
    enclosure_straps([width+offset_x*2+20,0,0.75]);
}
//}

// the base
module enclosure_base(offsets) {
    translate(offsets) {
        difference() {
            union() {
                hinged_box(width, length, height, 1);
                // lanyard attach point
                translate([0,-0.5*length-6, -0.5*(height+wall)+2.5]) {
                    difference() {
                        cylinder(r=9, h=5, center=true);
                        union() {
                            cylinder(r=5, h=5, center=true);
                            translate([0, 8.5, 0]) cube([18, 5, 5], center=true);
                        }
                    }
                }
                // lip
                union() {
                    lip_w=wall*1.5;
                    lip_h=6;
                    translate([half_w-lip_w/2,-half_l+20,wall+height/2-1]) cube([lip_w, 10, lip_h], center=true);
                    translate([-half_w+lip_w/2,-half_l+20,wall+height/2-1]) cube([lip_w, 10, lip_h], [0,2,0], center=true);
                    translate([half_w-lip_w/2,-half_l+56,wall+height/2-1]) cube([lip_w, 10, lip_h], center=true);
                    translate([-half_w+lip_w/2,-half_l+56,wall+height/2-1]) cube([lip_w, 10, lip_h], center=true);
                }
            }
            union() {
                // version stamp
                translate([0,0,-height/2+wall-0/0.25]) {
                    #linear_extrude(height=1, center=true)
                        text(model_version, size=4, valign="center", halign="center");
                }
                
                // aperture for the usb port
                translate([-width/2-wall, -length/2+39.5, height/2-1]) {
                   rotate(90) charge_port(10, 7, wall*2);
                }
                *translate([width/2+wall-1, -length/2+32, height/2-5]) {
                   #cube(5);
                }
                // aperture for the battery port
                translate([width/2+wall-1, -length/2+32, height/2-1]) {
                   rotate(90) #charge_port(10, 7, wall*2);
                }
                // latch push
                translate([0, length/2+width/4-1.25, width/4-2]) rotate([90,0,0]) #cylinder(r=7, h=inset*2, center=true);
            }
        }
    }
}

// the lid
module enclosure_lid(offsets) {
    translate(offsets) rotate([0,180,0]) {
        difference() {
            union() {
                hinged_box(width, length, lid_height, -1);
            }
            #translate([0,12,lid_height/2]) rotate(180) button(10,36,wall*2);
        }

    }
}

module enclosure_straps(offsets) {
    // the strap
    length=60;
    translate(offsets) {
        union() {
            translate([0,0,0]) cube([8, length, 1.5], center=true);
            #translate([0,-length/2+20,0.75]) cube([width-3, 1.5, 1.5], center=true);
            translate([0,-length/2+22,0]) cube([width, 8, 1.5], center=true);
            translate([0,length/2-4,0]) cube([width, 8, 1.5], center=true);
            translate([0,length/2-0.75,1]) cube([width, 1.5, 3], center=true);
        }
    }
}

module retainer(dims, center=false) {
    xdim=dims[0];
    ydim=dims[1];
    zdim=dims[2];
    half_z=zdim/2;
    translate([0, 0, center? half_z/2 : 0]) {
        cube([xdim, ydim, half_z], center=center);
        translate([0,0,half_z]) {
            if (center) {
                cube([xdim-zdim*2, ydim, half_z], center=center);
            }
            else {
                translate([zdim, 0, half_z]) cube([xdim-zdim*2, ydim, half_z], center=center);
            }
        }
    }

}

module outer_ridges(radius, length, bounds) {
    translate([-1*(bounds[0]/2+radius/2), 0]) {
        rotate([180,0,0]) ridge(radius, length, 1);
    }
    translate([bounds[0]/2+radius/2, 0]) {
        rotate([180,0,0]) ridge(radius, length, -1);
    }
}
module ridge(radius, length, orient=1) {
    rotate([0,0,orient<0?0:180])
    translate([-radius/2, 0, radius/2]) difference() {
        rotate([90,0,0]) cylinder(r=radius, h=length, center=true, $fn=12);
        union() {
            translate([0,0,radius/2]) cube([radius*2, length, radius], center=true);
            translate([-radius/2,0,0]) cube([radius, length, radius*2], center=true);
        }
    }
}

module hinged_oval_box(width, length, height, orient) {
    // WIP/not in use
    hull() {
        translate([0, -length/2+5, 2]) {
            resize(newsize=[width, width/2, height]) sphere(d=width, center=true);
        }
        translate([0, +length/2-5, 2]) {
            resize(newsize=[width*1.25, width/2, height]) sphere(d=width, center=true);
        }
    }
}
module hinged_box(width, length, height, orient) {
    hinge_radius=4;
    hinge_y_offset=length/2+radius_xy+hinge_radius/2;
    difference() {
        union() {
            difference() {
                shell(width, length, height, orient);
                translate([0, -1*hinge_y_offset, orient*(height/2)]) {
                  rotate(a=[0,90,0]) translate([0,0,0.25]) {
                        // add clearance for opposite hinge barrels
                      #cylinder(r=hinge_radius,
                                h=width*.66+orient*-hinge_radius*2,
                                center=true);
                  }
                }

            }
            translate([0, -1*hinge_y_offset, orient*(height/2)]) {
              rotate(a=[90,180,0]) translate([0,0,0.25]) {
                  _pin_hinge(width*.66, hinge_radius, orient>0?0:1);
              }
            }
            // the latch
            translate([0,length/2+8.5,orient*(height/2-3)]) {
                translate([0,-1.5,0]) cube([20, wall, 6], center=true);
            }
            if (orient > 0) {
                translate([0,length/2+7.25,height/2+4.5]) {
                    translate([0,-1,-4.5]) cube([10, wall*1.5, 10], center=true);
                    rotate([90, 90, 0]) ridge(1, 10, 1);
                }
            }
        }
        union() {
            if (orient < 0) {
                // lid latch receiver
                translate([0,length/2+7.25,height/2-3]) {
                    difference() {
                        translate([0,0,-1.5]) #cube([10, wall*1.5, 2], center=true);
                        *translate([0,-1,-4.5]) cube([10, wall*1.5, 10], center=true);
                    }
                }
            }
        }
    }
}

module _pin_hinge(h, radius, is_top=0, clearance=0) {
    fingers=5;
    pin_radius=1.5;
    gap=0.25;
    total_gap=(fingers-1)*gap;
    unit_h=(h-total_gap)/fingers;
    rotate([-90,0,0]) rotate([0,90,0]) translate([0,-radius,-1*(h/2)+unit_h/2]) {
        for(i=[0:fingers-1]) {
            if (i%2>0 && is_top) {
                translate([-0.5,0, gap*i+i*unit_h]) {
                    pin_hinge_unit(unit_h, radius, pin_radius, i, gap);
                    translate([radius,radius*2,0]) cube([radius*1.5, radius, unit_h], center=true);
                }
            }
            if (i%2==0 && !is_top) {
                translate([0.5,0, gap*i+i*unit_h]) {
                    pin_hinge_unit(unit_h, radius, pin_radius, i);
                    translate([-1*(radius),radius*2,0]) cube([radius*1.5, radius, unit_h], center=true);
                }
            }
        }
    }
}

module shell(width, length, height, orient=1) {
    difference() {
        union() {
            //cube([2,length, 2], center=true);
            hull() {
                linear_extrude(height=height+wall, center=true) {
                    offset(radius_xy) square([width-radius_xy*2+wall*2, length], center=true);
                }
                translate([0,length/2-wall,0]) {
                    difference() {
                        resize([width, width/2, height]) cylinder(d=width, height=height, center=true);
                        translate([0,-width/4,0]) cube([width, width/2, height], center=true);
                    }
                }
            }
        }
        translate([0,0,orient*wall]) {
            translate([0,length/2-inset, orient*wall]) {
                difference() {
                    resize([width-wall, width/2-wall*4, height+2*wall], auto=true) cylinder(d=width, height=height, center=true);
                    translate([0,-width/4+wall*2,0]) cube([width-wall, width/2-wall*4, height], center=true);
                }
            }
            cube([width, length, height], center=true);
        }
    }
    translate([0,length/2+wall,0]) {
        #cube([width*0.66, wall*2, height], center=true);
    }
}

module radiused_cube(dims, radii, center=true) {
    // radiused box sized to *outer* dimensions
    // flatten the radii to 1/2 height
    rad_x=radii[0];
    rad_y=radii[1];
    rad_z=radii[2];
    w=dims[0]; l=dims[1]; h=dims[2];

    translate([-w/2,-l/2,-h/2]) hull() {
        for(z=[0:1]) {
            translate([rad_x,rad_y,z==0?rad_z:h-rad_z]) {
                resize(newsize=[rad_x, rad_y, rad_z]) sphere(rad_x, center=true);
            }
            translate([w-rad_x,rad_y,z==0?rad_z:h-rad_z]) {
                resize(newsize=[rad_x, rad_y, rad_z]) sphere(rad_x, center=true);
            }
            translate([rad_x,l-rad_y,z==0?rad_z:h-rad_z]) {
                resize(newsize=[rad_x, rad_y, rad_z]) sphere(rad_x, center=true);
            }
            translate([w-rad_x,l-rad_y,z==0?rad_z:h-rad_z]) {
                resize(newsize=[rad_x, rad_y, rad_z]) sphere(rad_x, center=true);
            }
        }
    }
}

module button(radius, length, depth) {
    gap=1;
    difference() {
        linear_extrude(height=depth, twist=0, center=true) {
            difference() {
                offset(r=radius_xy+gap) {
                    circle(radius, center = true);
                    translate([0, 10, 0]) square([radius, radius*2.5], center = true);
                }
                offset(r=radius_xy) {
                    circle(radius, center = true);
                    translate([0, 10, 0]) square([radius, radius*2.5], center = true);
                }
            }
        }
        translate([0,  radius*2.5, 0]) cube([radius*2, radius_xy+gap, depth], center=true);
    }
}

module charge_port(width, height, wall) {
    radius=height/2;
    translate([0, -wall/2, 0]) rotate([90, 0, 0]) hull() {
        linear_extrude(height=wall, center=true) {
            offset(r=2) square([width-4, height-2], center=true);
        }
    }
}


