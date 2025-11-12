import Navigator from './Navbar'
import Routing from './Routeing'
import { BrowserRouter as Router } from "react-router-dom"
import './App.css'

function App() {
  return (
    <Router>
      <div className="root" style={{
        minHeight:"90vh",
        maxHeight:"90vh",
        scrollbarWidth:"none"
      }}>
        <header className="App-header">
          <Navigator />
        </header>
        <main style={{
          height:"90vh",
          overflowY:"scroll",
          backgroundColor:"black",
          scrollbarWidth:"none"
        }}>
          <Routing />
        </main>
      </div>
    </Router>
  );
}

export default App;
