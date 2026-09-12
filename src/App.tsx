import { PixelPanel } from "./components/PixelPanel";

function App() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="font-pixel text-banana text-2xl mb-6">
        Banana Trading Co.
      </h1>
      <PixelPanel className="max-w-sm">
        <p className="font-data text-text-dim text-sm mb-2">Sample Price</p>
        <p className="font-data text-gain text-3xl">$10.42</p>
      </PixelPanel>
    </div>
  );
}

export default App;