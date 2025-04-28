# firepwn2

An unofficial successor to the original [firepwn by 0xbigshaq](https://github.com/0xbigshaq/firepwn-tool).

**firepwn2** offers numerous improvements compared to the first one:

- A cleaner, more intuitive UI
- Safer, less error-prone user interactions
- Realtime Database (RTDB) querying
- Automated testing for common collection names
- OAuth authentication
- Fully hosted, ready-to-use experience

# Usage

> [!NOTE]  
> This application **does not** phone home.  
> Server-Side Rendering (SSR) is disabled.  
> You can always review the source code yourself for peace of mind.

## Option 1: Hosted Version

Simply visit [firepwn2.vercel.app](https://firepwn2.vercel.app) to start using the app instantly — no setup required.

## Option 2: Self-Hosting

> [!NOTE]  
> The following steps will only start a local preview.  
> To actually deploy and host the app yourself, you’ll need to find a server and select a [SvelteKit adapter](https://svelte.dev/docs/kit/adapters) that fits your environment.  
> Currently, the project uses `adapter-auto` by default.

```bash
# Clone the repository
git clone https://github.com/treesandflowers/firepwn2.git

# Navigate into the project directory
cd firepwn2

# Install dependencies
bun i

# Start a local preview
bun preview
```

Once running, you can access it at [localhost:5173](http://localhost:5173).
