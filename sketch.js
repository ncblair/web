// const s0 = ( sketch ) => {
//     let fbo_ux0;
//     let fbo_ux1;
//     let fbo_uy0;
//     let fbo_uy1;
//     let fbo_s0;
//     let fbo_s1;
//     let fbo_source;
//     let fbo_force_x;
//     let fbo_force_y;
//     let fbo_temp;

//     let display_mouse_shader;
//     let display_force_x_shader;
//     let display_force_y_shader;
//     let add_forces_shader;
//     let lin_solve_shader;
//     let advect_shader;
//     let self_advect_x_shader;
//     let self_advect_y_shader;
//     let project_shader_1;
//     let project_shader_2;
//     let project_shader_3;
//     let shdr2;
//     let frame = 0;
//     const FPS = 30;
//     const DT = 1.0 / FPS;
//     // const DT = 0.5;
//     const DIM = 512;
//     const VISC = 0.00001;
//     const DIFF = 0.00001;
//     const ITERS = 8; // MUST BE EVEN FOR LINSOLVE

//     sketch.setup = () => {
//         const canvas = sketch.createCanvas(DIM, DIM, WEBGL);
//         fbo_s0 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
//         fbo_s1 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
//         fbo_ux0 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
//         fbo_ux1 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
//         fbo_uy0 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
//         fbo_uy1 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
//         fbo_source = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
//         fbo_force_x = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
//         fbo_force_y = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
//         fbo_temp = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
//         // fbo2 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, floatTexture: true});
//         sketch.frameRate(FPS);
//         // Lets load a shader as well. 
//         display_mouse_shader = sketch.loadShader("sketch.vert", "display_mouse_pos.frag");
//         add_forces_shader = sketch.loadShader("sketch.vert", "add_forces.frag");
//         lin_solve_shader = sketch.loadShader("sketch.vert", "lin_solve.frag");
//         advect_shader = sketch.loadShader("sketch.vert", "advect.frag");
//         project_shader_1 = sketch.loadShader("sketch.vert", "project_shader_1.frag");
//         project_shader_2 = sketch.loadShader("sketch.vert", "project_shader_2.frag");
//         project_shader_3 = sketch.loadShader("sketch.vert", "project_shader_3.frag");
//         display_force_x_shader = sketch.loadShader("sketch.vert", "display_force_x.frag");
//         display_force_y_shader = sketch.loadShader("sketch.vert", "display_force_y.frag");
//         self_advect_x_shader = sketch.loadShader("sketch.vert", "self_advect_x.frag");
//         self_advect_y_shader = sketch.loadShader("sketch.vert", "self_advect_y.frag");
//         // shdr2 = loadShader("sketch.vert", "change_color.frag");
//     }

//     sketch.draw = () =>  {
//         sketch.noStroke();

//         let mouse_x = sketch.map(mouseX, 0, width, -1, 1);
//         let mouse_y = sketch.map(mouseY, 0, height, 1, -1);

//         fbo_source.begin();
//         display_mouse_shader.setUniform("mouse", [mouse_x, mouse_y]);
//         sketch.clear();
//         sketch.shader(display_mouse_shader);
//         sketch.quad(-1, -1, 1, -1, 1, 1, -1, 1);
//         fbo_source.end();

//         fbo_force_x.begin();
//         display_force_x_shader.setUniform("mouse", [mouse_x, mouse_y]);
//         display_force_x_shader.setUniform("time", frame / FPS);
//         sketch.clear();
//         sketch.shader(display_force_x_shader);
//         sketch.quad(-1, -1, 1, -1, 1, 1, -1, 1);
//         fbo_force_x.end();
        
//         // fbo_force_x.draw();

//         fbo_force_y.begin();
//         display_force_y_shader.setUniform("mouse", [mouse_x, mouse_y]);
//         display_force_y_shader.setUniform("time", frame / FPS);
//         sketch.clear();
//         sketch.shader(display_force_y_shader);
//         sketch.quad(-1, -1, 1, -1, 1, 1, -1, 1);
//         fbo_force_y.end();

//         // fbo_force_x.copyTo(fbo_ux0);
//         // fbo_force_y.copyTo(fbo_uy0);

//         // vstep(fbo_u0, fbo_u1);
//         // if (frame % 2 == 0) {
//         //     vstep(fbo_ux0, fbo_uy0, fbo_ux1, fbo_uy1, fbo_force_x, fbo_force_y);
//         // } else {
//         //     vstep(fbo_ux1, fbo_uy1, fbo_ux0, fbo_uy0, fbo_force_x, fbo_force_y);
//         // }
//         fbo_s0.copyTo(fbo_s1);
//         fbo_ux0.copyTo(fbo_ux1);
//         fbo_uy0.copyTo(fbo_uy1);
//         vstep(fbo_ux0, fbo_uy0, fbo_ux1, fbo_uy1, fbo_force_x, fbo_force_y);
//         sstep(fbo_s0, fbo_s1, fbo_source, fbo_ux0, fbo_uy0);

//         fbo_s0.draw();
//         // fbo_ux0.draw();
//         // fbo_force_x.draw();

//         frame++;


//         // shdr2.setUniform("inputTexture", fbo.getTexture());

//         // fbo2.begin();
//         // clear();
//         // shader(shdr2);
//         // quad(-1, -1, 1, -1, 1, 1, -1, 1);
//         // fbo2.end();

        
//         // shdr.setUniform("time", frameCount/FPS);
        
    
//         // // Now we need to draw the fbo to the screen. 
//         // fbo2.draw();
//     }


//     function vstep(ux, uy, ux_prev, uy_prev, Fx, Fy) {
//         // ADD FORCES
//         add_forces(ux, fbo_temp, Fx);
//         fbo_temp.copyTo(ux);
//         add_forces(uy, fbo_temp, Fy);
//         fbo_temp.copyTo(uy);
//         // DIFFUSE
//         let a = VISC * DIM * DIM * DT;
//         linSolve(ux_prev, ux, a, 1.0 + 4.0*a);
//         linSolve(uy_prev, uy, a, 1.0 + 4.0*a);
//         // // PROJECT
//         // project(ux_prev, uy_prev, ux, uy);
//         // // // ADVECT
//         // advect(ux, ux_prev, ux_prev, uy_prev);
//         // advect(uy, uy_prev, ux_prev, uy_prev);
//         // advect(ux_prev, ux, ux, uy);
//         // advect(uy_prev, uy, ux, uy);
//         self_advect(ux, ux_prev, uy_prev, 0);
//         self_advect(uy, ux_prev, uy_prev, 1);
//         // // // PROJECT
//         // project(ux, uy, ux_prev, uy_prev);
//         // ux_prev.copyTo(ux);
//         // uy_prev.copyTo(uy);
//     }

//     function sstep(scalar, scalar_prev, source, vel_x, vel_y) {
//         // ADD FORCES
//         add_forces(scalar, fbo_temp, source);
//         fbo_temp.copyTo(scalar);
//         // DIFFUSE
//         let a = DIFF * DIM * DIM * DT;
//         linSolve(scalar_prev, scalar, a, 1.0 + 4.0*a);
//         // ADVECT
//         advect(scalar, scalar_prev, vel_x, vel_y);
//     }

//     function linSolve(x, x_prev, a, c) {
//         // TODO: WHY DOES C NOT WORK IN THE SHADER? WTF??
//         // console.log(c);
//         // lin_solve_shader.setUniform("norm_const", c);
//         lin_solve_shader.setUniform("a", a);
//         lin_solve_shader.setUniform("resolution", 1.0 / DIM);
//         lin_solve_shader.setUniform("x_prev", x_prev.getTexture());
//         // x_prev.copyTo(x);
//         for (let k = 0; k < ITERS; k++) {
//             if (k % 2 == 0) {
//                 fbo_temp.begin();
//                 lin_solve_shader.setUniform("x", x.getTexture());
//                 clear();
//                 shader(lin_solve_shader);
//                 quad(-1, -1, 1, -1, 1, 1, -1, 1);
//                 fbo_temp.end();
//             } else {
//                 x.begin();
//                 lin_solve_shader.setUniform("x", fbo_temp.getTexture());
//                 clear();
//                 shader(lin_solve_shader);
//                 quad(-1, -1, 1, -1, 1, 1, -1, 1);
//                 x.end();
//             }
//         }
//     }

//     function advect(d, d0, ux, uy) {
//         d.begin();
//         advect_shader.setUniform("prev", d0.getTexture());
//         advect_shader.setUniform("vel_x", ux.getTexture());
//         advect_shader.setUniform("vel_y", uy.getTexture());
//         advect_shader.setUniform("dt", DT);
//         clear();
//         shader(advect_shader);
//         quad(-1, -1, 1, -1, 1, 1, -1, 1);
//         d.end();
//     }

//     function self_advect(out, x, y, dir) {
//         out.begin();
//         clear();
//         if (dir == 0) {
//             self_advect_x_shader.setUniform("vel_x", x.getTexture());
//             self_advect_x_shader.setUniform("vel_y", y.getTexture());
//             self_advect_x_shader.setUniform("dt", DT);
//             shader(self_advect_x_shader);
//         } else {
//             self_advect_y_shader.setUniform("vel_x", x.getTexture());
//             self_advect_y_shader.setUniform("vel_y", y.getTexture());
//             self_advect_y_shader.setUniform("dt", DT);
//             shader(self_advect_y_shader);
//         }
//         quad(-1, -1, 1, -1, 1, 1, -1, 1);
//         out.end();
//     }

//     function project(ux, uy, ux_prev, uy_prev) {
//         let h = 1.0 / DIM;
//         ux_prev.begin();
//         clear(0, 0, 0, 1);
//         quad(-1, -1, 1, -1, 1, 1, -1, 1);
//         ux_prev.end();
//         project_shader_1.setUniform("h", h);
//         project_shader_1.setUniform("resolution", DIM);
//         uy_prev.begin();
//         project_shader_1.setUniform("vel_x", ux.getTexture());
//         project_shader_1.setUniform("vel_y", uy.getTexture());
//         clear();
//         shader(project_shader_1);
//         quad(-1, -1, 1, -1, 1, 1, -1, 1);
//         uy_prev.end();
//         linSolve(ux_prev, uy_prev, 1, 4);
//         project_shader_2.setUniform("h", h);
//         project_shader_2.setUniform("resolution", DIM);
//         project_shader_3.setUniform("h", h);
//         project_shader_3.setUniform("resolution", DIM);
//         fbo_temp.begin();
//         project_shader_2.setUniform("inp", ux.getTexture());
//         project_shader_2.setUniform("p", ux_prev.getTexture());
//         clear();
//         shader(project_shader_2);
//         quad(-1, -1, 1, -1, 1, 1, -1, 1);
//         fbo_temp.end();
//         fbo_temp.copyTo(ux);
//         fbo_temp.begin();
//         project_shader_3.setUniform("inp", uy.getTexture());
//         project_shader_3.setUniform("p", uy_prev.getTexture());
//         clear();
//         shader(project_shader_3);
//         quad(-1, -1, 1, -1, 1, 1, -1, 1);
//         fbo_temp.end();
//         fbo_temp.copyTo(uy);
//     }

//     // def project(self, u, u_prev):
//     //     h = 1 / self.gridsize
//     //     u_prev[0] = 0
//     //     u_prev[1] = -0.5 * h * (np.roll(u[0], 1, axis=-2) - np.roll(u[0], -1, axis=-2) + np.roll(u[1], -1, axis=-1) - np.roll(u[1], 1, axis=-1))
//     //     self.linSolve(u_prev[0], u_prev[1], 1, 4)
//     //     u[0] -= 0.5 * (np.roll(u_prev[0], 1, axis=0) - np.roll(u_prev[0], -1, axis=0)) / h
//     //     u[1] -= 0.5 * (np.roll(u_prev[0], 1, axis=1) - np.roll(u_prev[0], -1, axis=1)) / h

//     function add_forces(input, out, forces) {
//         out.begin();
//         add_forces_shader.setUniform("field", input.getTexture());
//         add_forces_shader.setUniform("forces", forces.getTexture());
//         add_forces_shader.setUniform("dt", DT);
//         clear();
//         shader(add_forces_shader);
//         quad(-1, -1, 1, -1, 1, 1, -1, 1);
//         out.end();
//     }

//     // def linSolve(self, x, x_prev, a, c, iters=20):
//         // # solve for x using Gauss-Seidel relaxation
//         // for i in range(iters):
//         //     x[:] = (x_prev + a * (np.roll(x, 1, axis=-2) + np.roll(x, -1, axis=-2) + np.roll(x, 1, axis=-1) + np.roll(x, -1, axis=-1))) / (c)
// };
  
// let fluid_sim = new p5(s0, "fluid_sim");



const s1 = ( sketch ) => {

    // let mountain_fbo;
    let mountain_shader;
    let mountain_vid;
    let work_img;
    const FPS=30;
    const DIM=600;

    sketch.preload = () => {
        mountain_vid = sketch.createVideo(
            ['img/mountains/mountain.mp4'],
            sketch.vidLoad
        );
        mountain_vid.volume(0);

        work_img = sketch.loadImage('img/work/work.png');
    };
  
    sketch.setup = () => {
        const canvas = sketch.createCanvas(window.innerWidth, DIM, sketch.WEBGL);
        // fbo_s0 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, wrapMode: REPEAT, floatTexture: true});
        // fbo2 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, floatTexture: true});
        sketch.frameRate(FPS);
        // Lets load a shader as well. 
        mountain_shader = sketch.loadShader("sketch.vert", "mountain_of_work.frag");

        mountain_vid.size(sketch.width, DIM);
        mountain_vid.hide();

        work_img.resize(512, 512);

        sketch.textureWrap(sketch.REPEAT);
    };
  
    sketch.draw = () => {
        sketch.clear();
        sketch.noStroke();
        sketch.shader(mountain_shader);
        mountain_shader.setUniform("background", mountain_vid);
        mountain_shader.setUniform("overlay", work_img);
        mountain_shader.setUniform("time", sketch.frameCount / FPS);
        sketch.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    };

    sketch.vidLoad = () => {
        mountain_vid.loop();
        mountain_vid.volume(0);
    }
};


let mountain_of_work = new p5(s1, "mountain_of_work");


const s2 = ( sketch ) => {

    // let mountain_fbo;
    let self_advect_shader;
    let diffusion_shader;
    let display_mouse_shader;
    let add_forces_shader;
    let fbo_temp;
    let fbo_source;
    let clouds_vid;
    let fbo_0;
    let fbo_1;
    const FPS=30;
    const DIM=600;

    sketch.preload = () => {
        clouds_vid = sketch.createVideo(
            ['img/mountains/clouds.mp4'],
            sketch.vidLoad
        );
        clouds_vid.volume(0);
    };
  
    sketch.setup = () => {
        const canvas = sketch.createCanvas(window.innerWidth, DIM, sketch.WEBGL);
        fbo_0 = new p5Fbo({renderer: canvas, width: 512, height: 512, interpolationMode: sketch.LINEAR, wrapMode: sketch.CLAMP, floatTexture: true, instance: sketch});
        fbo_1 = new p5Fbo({renderer: canvas, width: 512, height: 512, interpolationMode: sketch.LINEAR, wrapMode: sketch.CLAMP, floatTexture: true, instance: sketch});
        fbo_temp = new p5Fbo({renderer: canvas, width: 512, height: 512, interpolationMode: sketch.LINEAR, wrapMode: sketch.CLAMP, floatTexture: true, instance: sketch});
        fbo_source = new p5Fbo({renderer: canvas, width: 512, height: 512, interpolationMode: sketch.LINEAR, wrapMode: sketch.CLAMP, floatTexture: true, instance: sketch});
        sketch.frameRate(FPS);
        // Lets load a shader as well. 
        self_advect_shader = sketch.loadShader("sketch.vert", "self_advect_x.frag");
        diffusion_shader = sketch.loadShader("sketch.vert", "lin_solve.frag");
        display_mouse_shader = sketch.loadShader("sketch.vert", "display_mouse_pos.frag");
        add_forces_shader = sketch.loadShader("sketch.vert", "add_forces.frag");

        clouds_vid.size(DIM, DIM);
        clouds_vid.hide();

        // sketch.textureWrap(sketch.REPEAT);
    };
  
    sketch.draw = () => {
        fbo_source.begin();
        sketch.clear();
        sketch.noStroke();
        sketch.shader(display_mouse_shader);
        let mouse_x = sketch.map(sketch.mouseX, 0, sketch.width, -1, 1);
        let mouse_y = sketch.map(sketch.mouseY, 0, sketch.height, 1, -1);
        display_mouse_shader.setUniform("mouse", [mouse_x, mouse_y]);
        sketch.quad(-1, -1, 1, -1, 1, 1, -1, 1);
        fbo_source.end();

        fbo_0.begin();
        sketch.clear();
        sketch.noStroke();
        sketch.shader(self_advect_shader);
        self_advect_shader.setUniform("vel_x", clouds_vid);
        self_advect_shader.setUniform("vel_y", fbo_1.getTexture());
        self_advect_shader.setUniform("dt", 0.1);
        sketch.quad(-1, -1, 1, -1, 1, 1, -1, 1);
        fbo_0.end();

        fbo_1.begin();
        sketch.clear();
        sketch.noStroke();
        sketch.shader(diffusion_shader);
        // diffusion_shader.setUniform("x_prev", clouds_vid);
        diffusion_shader.setUniform("x", fbo_0.getTexture());
        diffusion_shader.setUniform("a", 4.0);
        diffusion_shader.setUniform("resolution", 1.0 / sketch.width);
        sketch.quad(-1, -1, 1, -1, 1, 1, -1, 1);
        fbo_1.end();

        fbo_temp.begin();
        sketch.clear();
        sketch.noStroke();
        sketch.shader(add_forces_shader);
        add_forces_shader.setUniform("field", fbo_0.getTexture());
        add_forces_shader.setUniform("forces", fbo_source.getTexture());
        add_forces_shader.setUniform("dt", 1.0);
        sketch.quad(-1, -1, 1, -1, 1, 1, -1, 1);
        fbo_temp.end();
        fbo_temp.copyTo(fbo_1);

        fbo_0.draw();

    };

    sketch.vidLoad = () => {
        clouds_vid.loop();
        clouds_vid.volume(0);
    }
};


let clouds = new p5(s2, "clouds");



const s3 = ( sketch ) => {

    // let forest_fbo;
    // let forest_shader;
    // let forest_vid;
    const FPS=30;
    const DIM=600;

    sketch.preload = () => {
        
        forest_vid = sketch.createVideo(
            ['img/mountains/forest.mp4'],
            sketch.vidLoad
        );
        forest_vid.volume(0);
        forest_vid.size(window.innerWidth, window.outerHeight);
    };
  
    sketch.setup = () => {
        sketch.noCanvas();
        // const canvas = sketch.createCanvas(window.innerWidth, DIM, sketch.WEBGL);
        // forest_fbo = new p5Fbo({renderer: canvas, width: 512, height: 512, interpolationMode: sketch.LINEAR, wrapMode: sketch.CLAMP, floatTexture: true, instance: sketch});
        // fbo2 = new p5Fbo({renderer: canvas, width: DIM, height: DIM, floatTexture: true});
        sketch.frameRate(FPS);
        // Lets load a shader as well. 
        // forest_shader = sketch.loadShader("sketch.vert", "forest_floor.frag");

        
        // forest_vid.hide();
    };
  
    sketch.draw = () => {
        // forest_fbo.begin();
        // sketch.clear();
        // sketch.noStroke();
        // sketch.shader(forest_shader);
        // forest_shader.setUniform("background", forest_vid);
        // forest_shader.setUniform("overlay", work_img);
        // forest_shader.setUniform("time", sketch.frameCount / FPS);
        // sketch.quad(-1, -1, 1, -1, 1, 1, -1, 1);
        // forest_fbo.end();
        // forest_fbo.draw();
    };

    sketch.vidLoad = () => {
        forest_vid.loop();
        forest_vid.volume(0);
    }
};


let forest_floor = new p5(s3, "forest_floor");

let c_pos = 0.0;
let m_pos = 0.0;
let f_pos = 0.0;


document.addEventListener("wheel", (event) => {
    event.preventDefault();
    event.stopPropagation();
    // now define custom functionality

    let clouds_div = document.getElementById('clouds');
    let mountains_div = document.getElementById('mountain_of_work');
    let forest_div = document.getElementById('forest_floor');
    
    if (c_pos - event.deltaY <= 0.0 && (f_pos + clouds_div.offsetHeight + mountains_div.offsetHeight - event.deltaY) >= 0.0) {
        c_pos -= 0.1*event.deltaY;
        m_pos -= 0.8*event.deltaY;
        f_pos -= 1.4*event.deltaY;
        clouds_div.style.top = c_pos+'px';
        mountains_div.style.top = (m_pos+clouds_div.offsetHeight) + 'px';
        forest_div.style.top = (f_pos + clouds_div.offsetHeight + mountains_div.offsetHeight) + 'px';
    }
    
  }, { passive: false });