#### Ocean Model (Simple Version 1.1)

# 3D Hydrostatic Ocean Circulation Model

This repository implements a three-dimensional, hydrostatic, barotropic ocean circulation model that simulates surface currents driven by wind stress, modulated by planetary rotation, and influenced by bathymetry. The model supports layered vertical discretization and can be run with synthetic or user-provided bathymetry files. Outputs include NetCDF datasets and animated visualizations of surface current evolution with time.

---

## Dependencies

Install the required Python packages using:

```bash
pip install numpy xarray matplotlib imageio[ffmpeg] tqdm
```

> Note: Ensure `ffmpeg` is available (via `imageio[ffmpeg]` or system-wide) to enable MP4 video export.

---

## Usage

Run the simulation via:

```bash
python ocean_model.py [--animate] [--gif] [--video] [--bathymetry PATH_TO_FILE]
```

### Command-Line Arguments

| Argument        | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| `--animate`     | Enables live animation while the model runs                                |
| `--gif`         | Saves the animation as `surface_currents.gif`                              |
| `--video`       | Saves the animation as `surface_currents.mp4` (requires `ffmpeg`)          |
| `--bathymetry`  | Path to a NetCDF bathymetry file. If omitted, a synthetic Gaussian seamount is used |

---

## Output Files

- **`ocean_output.nc`**: NetCDF file containing the evolution of surface height `η`, and horizontal velocity components `u`, `v`
- **`surface_currents.gif`**: Optional animation of surface currents (if `--gif` is used)
- **`surface_currents.mp4`**: Optional video of surface currents (if `--video` is used)

---
## Mathematical Model Description

This simulation solves the hydrostatic primitive equations for a stratified ocean on a beta-plane, discretized on a Cartesian grid using finite differences.

The governing horizontal momentum equations for each vertical layer k are:

∂uₖ/∂t = -g ∂η/∂x + f(y) · vₖ - C_d uₖ √(uₖ² + vₖ²) + δₖ,₀ · (τₓ / (ρ H))

∂vₖ/∂t = -g ∂η/∂y - f(y) · uₖ - C_d vₖ √(uₖ² + vₖ²)

where:

- uₖ, vₖ are the horizontal velocity components at layer k  
- η is the free surface elevation (approximated by hydrostatic pressure gradients)  
- g is gravitational acceleration  
- f(y) = f₀ + β y is the Coriolis parameter varying with latitude y (beta-plane approximation)  
- C_d is the quadratic drag coefficient  
- δₖ,₀ is the Kronecker delta, applying wind stress forcing only at the surface layer  
- τₓ is the surface wind stress in the x-direction  
- ρ is the density (stratified by depth)  
- H is the layer thickness  

### Numerical Discretization

- Spatial derivatives use centered finite differences with periodic or Neumann boundary conditions:  
  - Horizontal derivatives:  
    ∂ϕ/∂x ≈ (ϕᵢ₊₁,ⱼ,ₖ - ϕᵢ₋₁,ⱼ,ₖ) / (2 Δx)  
    ∂ϕ/∂y ≈ (ϕᵢ,ⱼ₊₁,ₖ - ϕᵢ,ⱼ₋₁,ₖ) / (2 Δy)  

  - Laplacian operator for horizontal diffusion:  
    ∇²ϕ ≈ (ϕᵢ₊₁,ⱼ,ₖ - 2 ϕᵢ,ⱼ,ₖ + ϕᵢ₋₁,ⱼ,ₖ) / Δx² + (ϕᵢ,ⱼ₊₁,ₖ - 2 ϕᵢ,ⱼ,ₖ + ϕᵢ,ⱼ₋₁,ₖ) / Δy²  

  - Vertical diffusion uses second-order centered differences:  
    ∂²ϕ/∂z² ≈ (ϕᵢ,ⱼ,ₖ₊₁ - 2 ϕᵢ,ⱼ,ₖ + ϕᵢ,ⱼ,ₖ₋₁) / Δz²  

- Time integration uses explicit Euler with timestep Δt.

### Additional Features

- Hydrostatic pressure is updated by vertical integration of density stratification.  
- Vertical velocity w is diagnosed from horizontal divergence using discrete continuity:  
  wₖ = wₖ₋₁ - Δz · (∂u/∂x + ∂v/∂y)ₖ₋₁  

- Bathymetry is represented as a mask to disable flow below bottom topography.  
- Surface wind stress varies sinusoidally in time to drive circulation.

This model captures baroclinic dynamics and geostrophic balance under hydrostatic and Boussinesq approximations.


## License

This project is open-source and free to use under the MIT License.

