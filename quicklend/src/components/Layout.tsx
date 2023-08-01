import Topbar from './Topbar';
import  { ReactNode } from 'react';



interface LayoutProps {
    children: ReactNode;
  }
function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col  h-screen">
      <Topbar />
        <div className="flex-grow bg-gray-300 h-full p-4 top-[30rem]  overflow-auto ">{children}</div>
    </div>
  );
}

export default Layout;