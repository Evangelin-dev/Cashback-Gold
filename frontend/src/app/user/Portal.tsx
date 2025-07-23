import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // This finds the <div id="modal-root"></div> in your public/index.html
    const portalRoot = document.getElementById('modal-root');
    if (portalRoot) {
      setContainer(portalRoot);
    }
  }, []);

  // This "teleports" your popup's JSX into that container,
  // placing it outside the main app's scrolling context.
  return container ? ReactDOM.createPortal(children, container) : null;
};

export default Portal;