import { Route, Routes } from 'react-router-dom';
import About from '@/pages/About';
import Home from '@/pages/Home';

export enum AppRoutes {
  HOME = '/',
  ABOUT = '/about',
}

const AppRouter = () => {
  return (
    <Routes>
      <Route path={AppRoutes.HOME} element={<Home />} />
      <Route path={AppRoutes.ABOUT} element={<About />} />
    </Routes>
  );
};

export default AppRouter;
