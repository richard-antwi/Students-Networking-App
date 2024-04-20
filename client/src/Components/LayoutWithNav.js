// Assuming Layout is your component where you want to include NavBar,
// or you can create a new component that renders NavBar and its children.
import NavBar from '../Components/NavBar'
function LayoutWithNav({ children }) {
    return (
      <>
        <NavBar />
        <div className="Content">
          {children}
        </div>
      </>
    );
  }
  export default LayoutWithNav;