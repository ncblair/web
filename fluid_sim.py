import numpy as np
from matplotlib import pyplot as plt
import matplotlib.animation as animation

GRIDSIZE = 200
DT = 0.1
DIFF = 0.01
VISC = 0.1

def draw(img):
    plt.pause(.001)
    plt.imshow(img)

class StamFluidSim:
    def __init__(self, gridsize, dt, diff, visc, ndim=2):
        self.gridsize = gridsize
        self.dt = dt
        self.diff = diff
        self.visc = visc
        self.ndim = ndim
        self.coord = np.array(np.meshgrid(np.r_[:gridsize], np.r_[:gridsize]))
        # self.u0 = np.zeros((ndim, gridsize, gridsize))
        # self.u0[0] = 0.01
        self.u0 = np.ones((ndim, gridsize, gridsize)) * 0.1
        self.u1 = np.zeros((ndim, gridsize, gridsize))
        self.s0 = np.zeros((gridsize, gridsize))
        self.s1 = np.zeros((gridsize, gridsize))
        self.F = 0.3 * np.sin(self.coord)
        self.Ssource = np.zeros((gridsize, gridsize))
        for i in range(gridsize):
            for j in range(gridsize):
                self.Ssource[i, j] = 1 if np.sqrt((i - gridsize / 2)**2 + (j - gridsize / 2)**2) < gridsize / 8 else 0
                
        self.s1 = np.copy(self.Ssource)
        self.u1 = np.copy(self.F)
        
        self.t = 0

        # self.sstep(self.s1, self.s0, self.Ssource, self.u0) # initialize from init source

    def update(self):
        self.vstep(self.u0, self.u1, self.F)
        self.sstep(self.s0, self.s1, self.Ssource, self.u0)
        self.u0, self.u1 = self.u1, self.u0
        self.t += self.dt

    def vstep(self, u, u_prev, F):
        u += self.dt * F
        u, u_prev = u_prev, u
        a = self.dt * self.visc * self.gridsize * self.gridsize
        self.linSolve(u, u_prev, a, 1 + 4*a)
        self.project(u, u_prev)
        u, u_prev = u_prev, u
        self.advect(u[0], u_prev[0], u_prev)
        self.advect(u[1], u_prev[1], u_prev)
        self.project(u, u_prev)
        # self.u0 += self.dt * self.F # add force
        # for i in range(self.ndim): # transport
        #     self.transport(self.u1[i], self.u0[i])
        
    def sstep(self, scalar, scalar_prev, source, vel):
        scalar += self.dt * source # add source to density
        scalar, scalar_prev = scalar_prev, scalar
        a = self.dt * self.diff * self.gridsize * self.gridsize # diffusion constant
        self.linSolve(scalar, scalar_prev, a, 1 + 4*a) # diffuse
        scalar, scalar_prev = scalar_prev, scalar
        # scalar[:] = scalar_prev
        self.advect(scalar, scalar_prev, vel) # advect



    def linSolve(self, x, x_prev, a, c, iters=20):
        # solve for x using Gauss-Seidel relaxation
        for i in range(iters):
            x[:] = (x_prev + a * (np.roll(x, 1, axis=-2) + np.roll(x, -1, axis=-2) + np.roll(x, 1, axis=-1) + np.roll(x, -1, axis=-1))) / (c)

    def advect(self, d, d0, u):
        dt0 = self.dt * self.gridsize
        x = np.mod(self.coord[0] - dt0 * u[0], self.gridsize)
        y = np.mod(self.coord[1] - dt0 * u[1], self.gridsize)
        i0 = np.floor(x).astype(int)
        j0 = np.floor(y).astype(int)
        i1 = np.mod(i0 + 1, self.gridsize)
        j1 = np.mod(j0 + 1, self.gridsize)
        s1 = x - i0
        s0 = 1 - s1
        t1 = y - j0
        t0 = 1 - t1
        d[:] = s0 * (t0 * d0[j0, i0] + t1 * d0[j1, i0]) + s1 * (t0 * d0[j0, i1] + t1 * d0[j1, i1])
    
    def project(self, u, u_prev):
        h = 1 / self.gridsize
        u_prev[0] = 0
        u_prev[1] = -0.5 * h * (np.roll(u[0], 1, axis=-2) - np.roll(u[0], -1, axis=-2) + np.roll(u[1], -1, axis=-1) - np.roll(u[1], 1, axis=-1))
        self.linSolve(u_prev[0], u_prev[1], 1, 4)
        u[0] -= 0.5 * (np.roll(u_prev[0], 1, axis=0) - np.roll(u_prev[0], -1, axis=0)) / h
        u[1] -= 0.5 * (np.roll(u_prev[0], 1, axis=1) - np.roll(u_prev[0], -1, axis=1)) / h



def main():
    # Create a grid of zeros
    fluid = StamFluidSim(GRIDSIZE, DT, DIFF, VISC, ndim=2)
    fig, ax = plt.subplots()
    ims = []

    for i in range(500):
        fluid.update()
        im = ax.imshow(fluid.s0, vmin=0, vmax=1, cmap='gray', animated=True)
        if i == 0:
            ax.imshow(fluid.s0, vmin=0, vmax=1, cmap='gray')
        ims.append([im])
    
    ani = animation.ArtistAnimation(fig, ims, interval=16, blit=True,
                                repeat_delay=1000)
    plt.show()

if __name__ == "__main__":
    main()