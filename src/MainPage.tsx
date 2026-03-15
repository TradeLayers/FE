import { Outlet } from 'react-router-dom';

const MainPage: React.FC = () => {
    return (
        <div>
            <div>Main Page</div>
            <Outlet/>
        </div>
    );
};

export default MainPage;
